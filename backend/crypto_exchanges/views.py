from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_exchanges.models import Token
from crypto_exchanges.serializers import TokenSerializer, BinanceAccountSerializer
from crypto_exchanges.services import BinanceFetcher, BinanceService
from crypto_exchanges.models import BinanceAccount


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

    def post(self, request):
        serializer = BinanceAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        api_key = serializer.validated_data['api_key']
        secret_key = serializer.validated_data['secret_key']

        # Use the provided API key and secret key to connect to the Binance API
        service = BinanceService(api_key, secret_key)

        # Get the user's account information
        account = service.get_account()

        # Save the user's Binance account information
        BinanceAccount.objects.create(api_key=api_key, secret_key=secret_key)

        # Return the account information to the user
        return Response(account)