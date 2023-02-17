from rest_framework import serializers
from accounts.models import User
from crypto_wallets.models import CryptoWallet
from rest_framework.fields import CurrentUserDefault

from crypto_wallets.services import fetch_balance


class WalletSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = CryptoWallet
        fields = '__all__'
        extra_kwargs = {'balance': {'required': False}}

    def create(self, validated_data):
        crypto_wallet = CryptoWallet.objects.create(
            **validated_data,
            balance=fetch_balance(validated_data['address'], validated_data['cryptocurrency'])
        )
        crypto_wallet.save()
        return crypto_wallet
