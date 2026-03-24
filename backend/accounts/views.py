from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import RegisterSerializer,LoginSerializer,UserSerializer,VerifyOTPSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .permissions import IsActiveUser
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
import random
from datetime import timedelta
from django.utils.timezone import now
from .models import OTP

User = get_user_model()
# Create your views here.

class RegisterView(APIView):

    def post(self,request):
        data=request.data
        serializer=RegisterSerializer(data=data)
        if serializer.is_valid():
            return Response(
                {"message":"Validation successful. OTP sent"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self,request):
        data=request.data
        serializer= LoginSerializer(data=data)
        if serializer.is_valid():
            return Response(serializer.validated_data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    permission_classes=[IsAuthenticated,IsActiveUser]

    def get(self,request):
        user=request.user
        serializer= UserSerializer(user)
        return Response(serializer.data)
    

class SendOTPView(APIView):
    def post(self,request):
        serializer= RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        email= serializer.validated_data.get("email")


        last_otp = OTP.objects.filter(email=email).order_by("-created_at").first()
        if last_otp and now()-last_otp.created_at<timedelta(seconds=30):
            return Response({"error":"Wait 30 seconds before requesting another OTP"},status=status.HTTP_400_BAD_REQUEST)


        #removing old otps
        OTP.objects.filter(email=email).delete()

        otp=str(random.randint(100000,999999))
        OTP.objects.create(email=email,otp=otp)

        send_mail(
            subject="Email verification Code",
            message=f"Your OTP is {otp}",
            from_email=None,
            recipient_list=[email],
        )
        return Response({"message":"OTP sent successfully"})
    
class VerifyOTPView(APIView):
    def post(self, request):
        # Validate using serializer
        serializer = VerifyOTPSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        validated_data = serializer.validated_data
        email=validated_data.get("email")
        username = validated_data.get("username")
        password = validated_data.get("password")
        otp_input=validated_data.get("otp")

        
        otp_obj = OTP.objects.filter(email=email).order_by("-created_at").first()
        if not otp_obj:
            return Response({"error": "OTP not found"}, status=status.HTTP_400_BAD_REQUEST)

        if now() - otp_obj.created_at > timedelta(minutes=5):
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        if otp_obj.otp != otp_input:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        otp_obj.delete()

        return Response({"message": "User registered successfully"})