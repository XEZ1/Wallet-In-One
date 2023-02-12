from rest_framework import serializers
from accounts.models import User
from crypto_exchanges.models import Token, BinanceAccount
from rest_framework.fields import CurrentUserDefault
from crypto_exchanges.services import BinanceFetcher

class BinanceAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinanceAccount
        fields = ('user', 'api_key', 'secret_key', 'created_at')
class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ('asset', 'free', 'locked')
