from rest_framework import serializers
from .models import Order,OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name=serializers.CharField(source="product.name",read_only=True)
    product_image=serializers.CharField(source="product.image",read_only=True)
    class Meta:
        model=OrderItem
        fields = ["id","product_name","product_image","quantity","price"]

class OrderSerializer(serializers.ModelSerializer):
    items=OrderItemSerializer(many=True,read_only=True)
    class Meta:
        model=Order
        fields="__all__"

    def validate(self,data):
        request=self.context.get("request")

        if request and request.method in ["PATCH","PUT"]:
            if data.get("status")=="pending":

                required_fields = ["name","address","state","city","phone"]
                for field in required_fields:
                    value = data.get(field) or getattr(self.instance,field,None)
                    if not value:
                        raise serializers.ValidationError({
                            field:f"{field} is required to place order" 
                        })
        return data           



    
                    