from rest_framework import serializers
from .models import CartItem

class CartItemSerializer(serializers.ModelSerializer):
    name=serializers.CharField(source="product.name",read_only=True)
    price=serializers.DecimalField(source="product.price",max_digits=10,decimal_places=2,read_only=True)
    image=serializers.CharField(source="product.image",read_only=True)
    class Meta:
        model=CartItem
        fields= ['id','product','name','price','image','quantity']