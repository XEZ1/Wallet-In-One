from rest_framework import serializers
from crypto_exchanges.models import Token, CryptoExchangeAccount


# Token serializer
class TokenSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Token
        fields = ('user', 'asset', 'free', 'locked')

    def create(self, validated_data):
        token = Token.objects.create(
            **validated_data,
        )
        token.save()
        return token


# Crypto exchange account serialiser
class CryptoExchangeAccountSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = CryptoExchangeAccount
        fields = ('user', 'crypto_exchange', 'api_key', 'secret_key', 'created_at')

    def create(self, validated_data):
        crypto_exchange_account = CryptoExchangeAccount.objects.create(
            **validated_data,
        )
        crypto_exchange_account.save()
        return crypto_exchange_account
