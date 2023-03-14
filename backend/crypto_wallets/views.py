from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from crypto_wallets.models import CryptoWallet
from crypto_wallets.serializers import CryptoWalletSerializer
from crypto_wallets.services import calculate_received_spent, calculate_predicted_balance, calculate_average_spend


# Create your views here.

class CryptoWalletViewSet(GenericViewSet):
    serializer_class = CryptoWalletSerializer

    def get_queryset(self):
        return CryptoWallet.objects.filter(user=self.request.user)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True, context={'exclude_transactions': True})
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        crypto_wallet = self.get_object()
        serializer = self.get_serializer(crypto_wallet)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        crypto_wallet = self.get_object()
        crypto_wallet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CryptoWalletInsights(APIView):

    def get(self, request):
        predicted_balance = calculate_predicted_balance(self.request.user)
        received_spent = calculate_received_spent(self.request.user)
        average_spend = calculate_average_spend(self.request.user)
        return Response({'predicted_balance': predicted_balance, 'received_spent': received_spent, 'average_spend': average_spend})
