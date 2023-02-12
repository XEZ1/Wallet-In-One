from rest_framework import serializers
from crypto_exchanges.models import BinanceAccount

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

