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
import razorpay
from django.conf import settings
import hmac,hashlib
from wallet.models import Wallet, WalletTransaction

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
         order= Order.objects.create(user=user,total_price=0,payment_status="pending")
        
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
               total_price=total_price,
               payment_status="pending"
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
          serializer=OrderSerializer(
               order,
               data=request.data,
               partial=True,
               context={"request":request}
          )
          if serializer.is_valid():
               serializer.save()
               return Response({
                    "message":"Order updated succesfully"
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
          
          if order.payment_status == "refunded":
            return Response({"error": "Already refunded"}, status=400)
          
          if order.status=="cancelled":
               return Response({"error":"Order already cancelled"}) 
          

          if order.status=="delivered" or order.status=="shipped":
               return Response({"error":"Delivered order cannot be cancelled"},status=status.HTTP_400_BAD_REQUEST)
          

          order.status="cancelled"

          refunded=False
          if order.payment_status == "paid":
               if order.payment_method=="COD":
                    order.payment_status="pending"
                    order.save()
                    return Response({
                         "message":"COD order cancelled (no refund needed)"
                    })  

               wallet, _ = Wallet.objects.get_or_create(user=request.user)
               wallet.balance += order.total_price
               wallet.save()

               WalletTransaction.objects.create(
                    user=request.user,
                    amount=order.total_price,
                    transaction_type="credit",
                    description=f"Refund for order #{order.id}"
               )
               order.payment_status="refunded"
               refunded=True

          order.save()    
          return Response({
              "message": "Order cancelled successfully",
              "refunded": refunded
          })     
     

client=razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_KEY_SECRET))

class CreateRazorpayOrder(APIView):
    def post(self, request):
        amount = request.data.get("amount")  # in rupees
        
        if not amount:
             return Response({"error":"Amount is required"},status=status.HTTP_400_BAD_REQUEST)
        try:
             amount=float(amount)
        except ValueError:
             return Response({"error":"Invalid amount"},status=status.HTTP_400_BAD_REQUEST)     
        order_data = {
            "amount": int(amount * 100),  # paise
            "currency": "INR",
            "payment_capture": 1
        }

        razorpay_order = client.order.create(order_data)

        return Response({
            "order_id": razorpay_order["id"],
            "amount": amount
        })

class VerifyPayment(APIView): 
     def post(self, request):
         print("VERIFY API HIT")
         data = request.data
 
         razorpay_order_id = data.get("razorpay_order_id")
         payment_id = data.get("razorpay_payment_id")
         signature = data.get("razorpay_signature")
         db_order_id = data.get("order_id")
 
         order = get_object_or_404(Order, id=db_order_id)
         if order.payment_status == "paid":
             return Response({"message": "Already paid"})
             
 
         # ✅ Verify signature
         print("RAZORPAY ORDER ID:", razorpay_order_id)
         print("PAYMENT ID:", payment_id)
         print("SIGNATURE:", signature)
         generated_signature = hmac.new(
             bytes(settings.RAZORPAY_KEY_SECRET, 'utf-8'),
             bytes(razorpay_order_id + "|" + payment_id, 'utf-8'),
             hashlib.sha256
         ).hexdigest()
         print("GENERATED SIGNATURE:", generated_signature)
         print("MATCH:", generated_signature == signature)
 
         if generated_signature == signature:
 

             # ✅ Fetch Razorpay payment
             payment = client.payment.fetch(payment_id)
 
             # ✅ Save actual method
             order.payment_channel = payment.get("method")  # upi/card/netbanking
 
             # ✅ Update status
             order.status = "processing"
             order.payment_status="paid"
 
             order.save()
 
             # ✅ Clear cart
             cart = Cart.objects.filter(user=order.user).first()
             if cart:
                 CartItem.objects.filter(cart=cart).delete()

             return Response({"status": "success"})
        
         order.payment_status = "failed"
         order.status = "pending"
         order.save()    
         return Response({"status": "failed"})

class PaymentFailedView(APIView):
    def post(self, request):
        print("PAYMENT FAILED API HIT", request.data)
        order = Order.objects.get(id=request.data["order_id"])
        print("ORDER BEFORE:", order.payment_status)

        if order.payment_status == "paid":
            return Response({"message": "Already paid"})

        order.payment_status = "failed"
        order.status = "pending"
        order.save()
        print("ORDER AFTER:", order.payment_status)  


        return Response({"message": "Payment marked as failed"})