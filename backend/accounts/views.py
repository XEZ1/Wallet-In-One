from django.shortcuts import render
from accounts.models import User
from .serializers import SignUpSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

class sign_up(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SignUpSerializer
    queryset = User.objects.all()


@api_view(['GET'])
def validate_token(request):
    return Response({'token_valid': True})

from banking.services import total_user_balance, chart_breakdown

from crypto_wallets.services import total_user_balance_crypto, chart_breakdown_crypto

# Maybe this should go in new app
@api_view(['GET'])
def graph_data(request):
    data = {
        "all": []
    }
    
    bank_data = chart_breakdown(request.user)
    crypto_data = chart_breakdown_crypto(request.user)
    if bank_data:
        data['all'].append({"x": "Banks", "y": total_user_balance(request.user).amount})
        data['Banks'] = bank_data
    if crypto_data:
        data['all'].append({"x": "Cryptocurrency", "y": total_user_balance_crypto(request.user)})
        data['Cryptocurrency'] = crypto_data
    print(data)
    return Response(data)
