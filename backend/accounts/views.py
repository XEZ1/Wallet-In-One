from django.shortcuts import render
from accounts.models import User
from .serializers import SignUpSerializer, ChangePasswordSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.

class sign_up(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SignUpSerializer
    queryset = User.objects.all()


class change_password(generics.CreateAPIView):
    serializer_class = ChangePasswordSerializer


@api_view(['GET'])
def validate_token(request):
    return Response({'token_valid': True})