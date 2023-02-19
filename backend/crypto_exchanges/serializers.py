from rest_framework import serializers
from crypto_exchanges.models import Token, BinanceAccount, HuobiAccount, GateioAccount, CoinListAccount, KrakenAccount


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

class HuobiAccountSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = HuobiAccount
        fields = ('user', 'api_key', 'secret_key', 'created_at')

    def create(self, validated_data):
        Huobi_account = HuobiAccount.objects.create(
            **validated_data,
        )
        Huobi_account.save()
        return Huobi_account

class GateioAccountSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = GateioAccount
        fields = ('user', 'api_key', 'secret_key', 'created_at')

    def create(self, validated_data):
        gateio_account = GateioAccount.objects.create(
            **validated_data,
        )
        gateio_account.save()
        return gateio_account

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

class KrakenAccountSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = KrakenAccount
        fields = ('user', 'api_key', 'secret_key', 'created_at')

    def create(self, validated_data):
        kraken_account = KrakenAccount.objects.create(
            **validated_data,
        )
        kraken_account.save()
        return kraken_account
