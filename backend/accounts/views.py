from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import RegisterSerializer,LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class RegisterView(APIView):

    def post(self,request):
        data=request.data
        serializer=RegisterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self,request):
        data=request.data
        serializer= LoginSerializer(data=data)
        if serializer.is_valid():
            return Response(serializer.validated_data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class Auth_view(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        return Response({
            'messege':"toke is valid",
            "user":request.user.email,
        })
