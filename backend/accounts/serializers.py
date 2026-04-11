from rest_framework import serializers
import re
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

User=get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password=serializers.CharField(write_only=True)

    class Meta:
        model=User
        fields=['username','email','password','confirm_password']
        extra_kwargs={
            'password':{"write_only":True}
        }

    def validate_username(self,value):

        if not value.strip():
            raise serializers.ValidationError(
                "Enter a valid name"
            )
        
        if len(value)<3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters"
            )
        if not re.match(r'^[A-Za-z0-9_]+$',value):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers and underscore"
            )
        
        return value
    
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already registered"
            )
        return value

    def validate_password(self,value):
        password_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$'

        if not re.match(password_pattern,value):
            raise serializers.ValidationError(
                "Password must contain uppercase, lowercase, number and be at least 8 characters"
            )
        return value
    
    def validate(self,data):
        if data["password"]!=data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password":"Password do not match"}
            )
        return data

    
    
class LoginSerializer(serializers.Serializer):
    email=serializers.EmailField()
    password=serializers.CharField(write_only=True)
    
    def validate(self,data):
        email=data.get('email')
        password=data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")
            

        if not user.is_active:
            raise serializers.ValidationError("Your account has been blocked by admin")
        
        
        user=authenticate(username=email,password=password)

        if user is None:
            raise serializers.ValidationError('Invalid credentials')
        
        refresh = RefreshToken.for_user(user)
        
        return {
            'user_id':user.id,
            "username":user.username,
            'email':user.email,
            'access':str(refresh.access_token),
            'refresh':str(refresh)
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields= ["id",'username','email']        


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    otp = serializers.CharField()

    # 🔹 Username validation (same as Register)
    def validate_username(self, value):
        if not value.strip():
            raise serializers.ValidationError("Enter a valid name")

        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters"
            )

        if not re.match(r'^[A-Za-z0-9_]+$', value):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers and underscore"
            )

        return value

    # 🔹 Password validation (same as Register)
    def validate_password(self, value):
        password_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$'

        if not re.match(password_pattern, value):
            raise serializers.ValidationError(
                "Password must contain uppercase, lowercase, number and be at least 8 characters"
            )

        return value

    #  OTP validation 
    def validate_otp(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("OTP must contain only digits")

        if len(value) != 6:
            raise serializers.ValidationError("OTP must be 6 digits")

        return value        