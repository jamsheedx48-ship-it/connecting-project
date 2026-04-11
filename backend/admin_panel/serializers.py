from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from products.models import Product,Category
from orders.models import Order,OrderItem

User=get_user_model()

class AdminLoginSerializer(serializers.Serializer):
    email=serializers.EmailField(required=True)
    password=serializers.CharField(required=True)

    def validate(self,data):
        email=data.get("email")
        password=data.get("password")
        user= User.objects.filter(email=email).first()

        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_active:
            raise serializers.ValidationError("Account is blocked")
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_staff:
            raise serializers.ValidationError("Not an admin")
        
        refresh=RefreshToken.for_user(user)

        return{
            "user_id":user.id,
            "username":user.username,
            "email":user.email,
            "is_staff":user.is_staff,
            "access":str(refresh.access_token),
            "refresh":str(refresh),
            
        }


class AdminProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)  # writable for input
    image_url = serializers.SerializerMethodField() 
    category_name = serializers.SerializerMethodField()
    
    class Meta:
        model= Product
        fields = ["id","name", "type", "price", "category", 
                  "category_name","image", "image_url", "stock", "featured"]
    
        
    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None    

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.name
        return None    

    def validate_name(self,data):
        if len(data.strip())<3:
            raise serializers.ValidationError("Name must be at least 3 characters")
        return data

    def validate_type(self, value):
        if not value.strip():
            raise serializers.ValidationError("Type cannot be empty")
        return value
    
    def validate_price(self,data):
        if data<=0:
            raise serializers.ValidationError("Price must be greater than 0")
        return data
    
    def validate_image(self, data):
        if data and hasattr(data, "content_type"):
            if not data.content_type.startswith("image"):
                raise serializers.ValidationError("Only image files are allowed")
        return data
    
    def validate_stock(self,data):
        if data<0:
            raise serializers.ValidationError("Stock cannot be negative")
        return data
    
    def validate_category(self, value):
        if value is None:
            raise serializers.ValidationError("Category is required")
        return value
    

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product_name", "quantity", "price"]

class AdminOrderListSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source="user.username",default="Guest", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "total_price",
            "payment_method",
            "payment_channel",
            "payment_status",
            "status",
            "created_at",
        ]

class AdminOrderDetailSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source="user.username")
    email = serializers.CharField(source="user.email")
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = "__all__"        
