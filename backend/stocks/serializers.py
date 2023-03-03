from rest_framework import serializers
from .models import StockAccount,Transaction
from rest_framework.fields import CurrentUserDefault

class AddStockAccount(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = StockAccount
        fields = ['account_id', 'name', 'user', 'institution_name', 'institution_id', 'access_token', 'balance']

    def validate(self, attrs):
        super().validate(attrs)
        if StockAccount.objects.filter(name=attrs['name'], institution_name=attrs['institution_id']).exists():
            raise serializers.ValidationError('Account already exists')
        return attrs

    def create(self, validated_data):
        account = StockAccount.objects.create(**validated_data)
        account.save()
        return account
    
class AddTransaction(serializers.ModelSerializer):
    # stock = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Transaction
        fields = '__all__'

    def validate(self, attrs):
        super().validate(attrs)
        print("Validation")
        # if StockAccount.objects.filter(name=attrs['name'], institution_name=attrs['institution_id']).exists():
            # raise serializers.ValidationError('Account already exists')
        return attrs