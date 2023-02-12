from rest_framework import serializers
from .models import Account
from .services import get_account_data, get_account_details, get_institution

class URLSerializer(serializers.Serializer):
    url = serializers.URLField()

class AccountSerializer(serializers.ModelSerializer):
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