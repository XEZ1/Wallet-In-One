from rest_framework import serializers
from .models import Account, Transaction
from .services import get_account_data, get_account_details, get_institution, account_balance
from djmoney.contrib.django_rest_framework import MoneyField
from .util import main_image_color

class URLSerializer(serializers.Serializer):
    url = serializers.URLField()

class OldAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        data = get_account_data(instance.id)
        details = get_account_details(instance.id)
        institution = get_institution(data['institution_id'])

        representation.update({
            'data': data,
            'details': details,
            'institution': institution,
        })

        return representation

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation.update({
            'balance': format_money(account_balance(instance)),
        })

        representation['color'] = main_image_color(representation['institution_logo'])

        return representation

class AmountSerializer(serializers.Serializer):
    amount = MoneyField(max_digits=11, decimal_places=2)

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.update({
            'formatted_amount': format_money(instance.amount)
        })
        return representation

def format_money(money):
    return {'string':str(money),'currency':str(money.currency),'amount':str(money.amount)}