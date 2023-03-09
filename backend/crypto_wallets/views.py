from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_wallets.models import CryptoWallet
from crypto_wallets.seralizers import WalletSerializer
from crypto_wallets.services import calculate_received_spent, calculate_predicted_balance, calculate_average_spend


# Create your views here.


class ListCryptoWallets(APIView):

    def get(self, request):
        crypto_wallets = CryptoWallet.objects.filter(user=self.request.user)
        serializer = WalletSerializer(crypto_wallets, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WalletSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        crypto_wallet = CryptoWallet.objects.get(id=request.data['id'])
        if crypto_wallet.user != self.request.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = WalletSerializer(crypto_wallet)
        crypto_wallet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CryptoWalletInsights(APIView):

    def get(self, request):
        predicted_balance = calculate_predicted_balance(self.request.user)
        received_spent = calculate_received_spent(self.request.user)
        average_spend = calculate_average_spend(self.request.user)
        return Response({'predicted_balance': predicted_balance, 'received_spent': received_spent, 'average_spend': average_spend})
