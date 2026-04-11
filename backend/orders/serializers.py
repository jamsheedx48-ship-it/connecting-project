from rest_framework import serializers
from .models import Order,OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name=serializers.CharField(source="product.name",read_only=True)
    product_image=serializers.SerializerMethodField(source="product.image",read_only=True)
    class Meta:
        model=OrderItem
        fields = ["id","product_name","product_image","quantity","price"]

    def get_product_image(self, obj):
        if obj.product.image:
            return obj.product.image.url   #  Cloudinary URL
        return None    


class OrderSerializer(serializers.ModelSerializer):
    items=OrderItemSerializer(many=True,read_only=True)
    class Meta:
        model=Order
        fields="__all__"

    def validate(self,data):
        request=self.context.get("request")

        if request and request.method in ["PATCH","PUT"]:
            status=data.get("status") or self.instance.status
            if status=="pending":

                required_fields = ["name","address","state","city","phone"]
                for field in required_fields:
                    value = data.get(field) or getattr(self.instance,field,None)
                    if not value:
                        raise serializers.ValidationError({
                            field:f"{field} is required to place order" 
                        })
                    
                payment_method= data.get("payment_method") or self.instance.payment_method
                if not payment_method:
                    raise serializers.ValidationError({
                        "payment_method":"payment method is required"
                    })
                name= data.get("name") or self.instance.name
                if len(name)<3:
                    raise serializers.ValidationError({
                        "name":"Name must be at least 3 characters"
                    })
                phone= data.get("phone") or self.instance.phone
                if not phone.isdigit() or len(phone)!=10:
                    raise serializers.ValidationError({
                        "phone":"Invalid phone number"
                    })

        return data           



    
                    