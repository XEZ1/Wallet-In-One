from rest_framework import serializers
from .models import StockAccount

class AddStockAccount(serializers.ModelSerializer):
    class Meta:
        model = StockAccount
        fields = ['account_id', 'name']

        def create(self, validated_data):
            account = StockAccount.objects.create(
                account_id=validated_data['account_id'],
                name=validated_data['name'],
                user = self.context['request'].user.id
            )
            account.save()
            return account