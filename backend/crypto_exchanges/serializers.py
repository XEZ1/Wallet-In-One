from rest_framework import serializers
from accounts.models import User
from crypto_exchanges.models import Token
from rest_framework.fields import CurrentUserDefault
from crypto_exchanges.services import BinanceFetcher

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ('asset', 'free', 'locked')
