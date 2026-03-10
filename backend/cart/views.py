from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from products.models import Product
from .models import Cart,CartItem
from .serializers import CartItemSerializer
from rest_framework import status
from django.shortcuts import get_object_or_404
# Create your views here.

class AddToCartView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        user=request.user
        product_id=request.data.get("product_id")
        product=get_object_or_404(Product,id=product_id)
        cart,created=Cart.objects.get_or_create(user=user)

        cart_item,created=CartItem.objects.get_or_create(
            cart=cart,
            product=product
            
        )
        if not created:
            cart_item.quantity+=1
            cart_item.save()

        serializer = CartItemSerializer(cart_item)    

        return Response(serializer.data)  


class CartView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        cart,_= Cart.objects.get_or_create(user=request.user)
        items= CartItem.objects.filter(cart=cart)

        serializer= CartItemSerializer(items,many=True)

        return Response(serializer.data)
    
class RemoveCartItemView(APIView):
    permission_classes=[IsAuthenticated] 

    def delete(self,request,id):
        try:
            cart=Cart.objects.get(user=request.user)
            item=CartItem.objects.get(id=id,cart=cart)
            item.delete()
            return Response({"message":"Item removed from cart"},status=status.HTTP_200_OK)
        
        except CartItem.DoesNotExist:
            return Response(
                {"message":"Item not found"},
                status=status.HTTP_404_NOT_FOUND
            )   
        
class UpdateCartItemView(APIView):
    permission_classes=[IsAuthenticated]

    def patch(self,request,id):
        try:
            cart=Cart.objects.get(user=request.user)
            item=CartItem.objects.get(id=id,cart=cart)
            quantity=request.data.get("quantity")
            
            if quantity is None:
                return Response(
                    {"message":"Quantity is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            item.quantity=quantity
            item.save()
            return Response(
                {"message":"Cart updated"},
                status=status.HTTP_200_OK
            )

        except CartItem.DoesNotExist:
            return Response(
                {"message":"item not found"},
                status=status.HTTP_404_NOT_FOUND

            )        

