from django.shortcuts import render
from rest_framework.views import APIView
from .models import Product
from .serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
# Create your views here.

class ProductListView(APIView):
    permission_classes=[AllowAny]
    
    def get(self,request):
        products = Product.objects.all()
        serializer = ProductSerializer(products,many=True)
        return Response(serializer.data)
    
    def post(self,request):
        data=request.data
        serializer=ProductSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)    
    
class ProductDeatilView(APIView):

    def get(self,request,id):
        try:
            product= Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response(
                {"message":"Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer=ProductSerializer(product)
        return Response(serializer.data)    