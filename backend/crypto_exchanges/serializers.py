from rest_framework import serializers
from crypto_exchanges.models import Token, BinanceAccount, CoinListAccount

class BinanceAccountSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = BinanceAccount
        fields = ('user', 'api_key', 'secret_key', 'created_at')

    def create(self, validated_data):
        binance_account = BinanceAccount.objects.create(
            **validated_data,
        )
        binance_account.save()
        return binance_account

class CoinListAccountSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = CoinListAccount
        fields = ('user', 'api_key', 'secret_key', 'created_at')

    def create(self, validated_data):
        coinlist_account = CoinListAccount.objects.create(
            **validated_data,
        )
        coinlist_account.save()
        return coinlist_account

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
