from rest_framework import serializers
from .models import Product,Category

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source="category.name", read_only=True)


    class Meta:
        model=Product
        fields="__all__"

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None    
        


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]