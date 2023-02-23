from rest_framework import serializers
from accounts.models import User
from crypto_wallets.models import CryptoWallet, CryptoWalletTransaction
from rest_framework.fields import CurrentUserDefault

from crypto_wallets.services import fetch_balance, CryptoWalletService, get_timestamp


class WalletTransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = CryptoWalletTransaction
        fields = ('value', 'time')


class WalletSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    transactions = WalletTransactionSerializer(source='cryptowallettransaction_set', many=True, required=False)

    class Meta:
        model = CryptoWallet
        fields = ('user', 'id', 'cryptocurrency', 'symbol', 'address', 'balance', 'transactions')
        extra_kwargs = {'balance': {'required': False}}


    def create(self, validated_data):
        crypto_wallet_service = CryptoWalletService(validated_data['cryptocurrency'], validated_data['address'])
        crypto_wallet = CryptoWallet.objects.create(
            **validated_data,
            balance=crypto_wallet_service.balance
        )
        crypto_wallet.save()
        for transaction in crypto_wallet_service.transactions:
            crypto_wallet_transaction = CryptoWalletTransaction.objects.create(
                crypto_wallet=crypto_wallet,
                value=transaction['balance_change'],
                time=get_timestamp(transaction['time'])  # Is this correct?
            )
            crypto_wallet_transaction.save()
        return crypto_wallet


