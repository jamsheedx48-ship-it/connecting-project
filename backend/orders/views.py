from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsActiveUser
from cart.models import Cart,CartItem
from rest_framework.response import Response
from .models import Order,OrderItem
from products.models import Product
from rest_framework import status
from .serializers import OrderSerializer
# Create your views here.

class CreateOrderView(APIView):
    permission_classes=[IsAuthenticated,IsActiveUser]

    def post(self,request):
         user=request.user

         cart=Cart.objects.get(user=user)
         cart_items=CartItem.objects.filter(cart=cart)

         if not cart_items.exists():
              return Response({"message":"Cart is empty"})
         
         for item in cart_items:
              if item.product.stock<item.quantity:
                   return Response(
                        {"message":f"{item.product.name} is out of stock"},
                        status=status.HTTP_400_BAD_REQUEST
                   )
         
         total_price=0
         order= Order.objects.create(user=user,total_price=0)
        
         for item in cart_items:
              price= item.product.price * item.quantity
              total_price+= price

              OrderItem.objects.create(
                   order=order,
                   product=item.product,
                   quantity=item.quantity,
                   price=item.product.price
              )

         order.total_price=total_price
         order.save()
         return Response({"message":"Order created successfully","order_id":order.id})
        
class BuyNowView(APIView):
     permission_classes=[IsAuthenticated,IsActiveUser]

     def post(self,request):
          user=request.user
          product_id=request.data.get("product_id")  
          quantity=int(request.data.get("quantity",1))

          try:
               product=Product.objects.get(id=product_id)
          except Product.DoesNotExist:
               return Response(
                    {"message":"Product not found"},
                    status=status.HTTP_404_NOT_FOUND
               )
          if product.stock<quantity:
               return Response(
                    {"message":f"{product.name} is out of stock"},
                    status=status.HTTP_400_BAD_REQUEST
               )
          
          total_price=product.price*quantity
          order=Order.objects.create(
               user=user,
               total_price=total_price
          )

          OrderItem.objects.create(
               order=order,
               product=product,
               quantity=quantity,
               price=product.price
          )

          cart = Cart.objects.filter(user=user).first()
          if cart:
               CartItem.objects.filter(cart=cart,product=product).delete()
          
          return Response({
               "message":"Order created",
               "order_id":order.id
          })


class OrderDetailView(APIView):
     permission_classes=[IsAuthenticated,IsActiveUser]

     def get(self,request,order_id):
          order=get_object_or_404(
               Order,
               id=order_id,
               user=request.user
          )
          serializer= OrderSerializer(order)
          return Response(serializer.data)
     
     def patch(self,request,order_id):
          order=get_object_or_404(
               Order,
               id=order_id,
               user=request.user
          )
          old_status=order.status
          serializer=OrderSerializer(
               order,
               data=request.data,
               partial=True,
               context={"request":request}
          )
          if serializer.is_valid():
               serializer.save()
               new_status=serializer.validated_data.get("status")
               print(new_status)
               print(old_status)

               if new_status=="processing" and old_status!="processing":
                   for items in order.items.all():
                        product=items.product
                        product.stock-=items.quantity
                        product.save()


                   cart= Cart.objects.filter(user=request.user).first()
                   if cart:
                       CartItem.objects.filter(cart=cart).delete()

               return Response({
                  "message":"Order updated successfully"
               })
          return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class UserOrdersView(APIView):
     permission_classes=[IsAuthenticated,IsActiveUser]

     def get(self,request):
          order=Order.objects.filter(user=request.user).order_by("-id")
          serializer=OrderSerializer(order,many=True)
          return Response(serializer.data)

class CancelOrderView(APIView):
     permission_classes=[IsAuthenticated,IsActiveUser]

     def post(self,request,order_id):
          order=get_object_or_404(Order,id=order_id,user=request.user)

          if order.status=="cancelled":
               return Response({"error":"Order already cancelled"}) 
          

          if order.status=="delivered" or order.status=="shipped":
               return Response({"error":"Delivered order cannot be cancelled"},status=status.HTTP_400_BAD_REQUEST)
          
          for items in order.items.all():
               product=items.product
               product.stock+=items.quantity
               product.save()

          order.status="cancelled"   
          order.save()   
          return Response({"message":"Order cancelled successfully"})