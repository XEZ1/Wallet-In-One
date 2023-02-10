from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Token
from .serializers import TokenSerializer
from .services import BinanceFetcher
from .models import BinanceAccount


# Create your views here.

class BinanceAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        try:
            binance_account = BinanceAccount.objects.get(user=user)
        except BinanceAccount.DoesNotExist:
            return Response({"error": "Binance account is not connected."})

        try:
            tokens = BinanceFetcher.fetch_tokens(binance_account.access_token)
            serializer = TokenSerializer(tokens, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)})