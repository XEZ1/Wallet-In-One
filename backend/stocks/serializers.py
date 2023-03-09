from rest_framework import serializers

from .models import StockAccount,Transaction, Stock

from rest_framework.fields import CurrentUserDefault

class AddStockAccount(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = StockAccount
        fields = '__all__'

    def validate(self, attrs):
        super().validate(attrs)
        if StockAccount.objects.filter(name=attrs['name'], institution_id=attrs['institution_id']).exists():
            raise serializers.ValidationError('Account already exists')
        return attrs

    def create(self, validated_data):
        account = StockAccount.objects.create(**validated_data)
        account.save()
        return account
    

class AddTransaction(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class AddStock(serializers.ModelSerializer):

    class Meta:
       model = Stock
       fields = '__all__'


