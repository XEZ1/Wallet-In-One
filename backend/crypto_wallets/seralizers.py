from rest_framework import serializers
from accounts.models import User
from crypto_wallets.models import CryptoWallet
from rest_framework.fields import CurrentUserDefault


# Address and blockchain automatically provided
# Use validators


class WalletSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = CryptoWallet
        exclude = ['value']


