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

from banking.services import total_user_balance, chart_breakdown

# Maybe this should go in new app
@api_view(['GET'])
def graph_data(request):
    data = {
        "all": [
            {
                "x": "Banks",
                "y": total_user_balance(request.user).amount
            }
        ]
    }
    
    bank_data = chart_breakdown(request.user)
    if bank_data:
        data['Banks'] = bank_data

    return Response(data)
