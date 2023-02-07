from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_wallets.models import CryptoWallet
from crypto_wallets.seralizers import WalletSerializer


# Create your views here.


class ListCryptoWallets(APIView):
    """
    Read wallet address and blockchain
    Use bitcoin api to read current value
    Save address, blockchain and current value
    Return data
    """

    def get(self, request):
        crypto_wallets = CryptoWallet.objects.all()  # get current user only.
        serializer = WalletSerializer(crypto_wallets, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WalletSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

