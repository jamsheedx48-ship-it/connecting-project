from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

User=get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','email','password']
        extra_kwargs={
            'password':{"write_only":True}
        }

    def create(self, validated_data):
        user=User.objects.create_user(**validated_data)    
        return user
    
class LoginSerializer(serializers.Serializer):
    email=serializers.EmailField()
    password=serializers.CharField()
    
    def validate(self,data):
        email=data.get('email')
        password=data.get('password')

        user=authenticate(email=email,password=password)

        if user is None:
            raise serializers.ValidationError('Invalid credentials')
        
        refresh = RefreshToken.for_user(user)
        
        return {
            'user_id':user.id,
            'email':user.email,
            'access':str(refresh.access_token),
            'refresh':str(refresh)
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields= ["id",'username','email']        