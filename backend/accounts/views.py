from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import RegisterSerializer,LoginSerializer,UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .permissions import IsActiveUser
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

class UserView(APIView):
    permission_classes=[IsAuthenticated,IsActiveUser]

    def get(self,request):
        user=request.user
        serializer= UserSerializer(user)
        return Response(serializer.data)