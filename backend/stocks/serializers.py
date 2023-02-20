from rest_framework import serializers
from .models import StockAccount
from rest_framework.fields import CurrentUserDefault

class AddStockAccount(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = StockAccount
        fields = ['account_id', 'name', 'user']

        def create(self, validated_data):
            account = StockAccount.objects.create(**validated_data)
            account.save()
            return account