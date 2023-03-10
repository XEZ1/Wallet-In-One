from rest_framework import serializers
from crypto_wallets.models import CryptoWallet, CryptoWalletTransaction
from crypto_wallets.services import CryptoWalletService, get_timestamp, normalise_value


class WalletTransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = CryptoWalletTransaction
        fields = ('id', 'value', 'time')


class WalletSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    transactions = WalletTransactionSerializer(source='cryptowallettransaction_set', many=True, required=False)

    class Meta:
        model = CryptoWallet
        fields = ('user', 'id', 'cryptocurrency', 'symbol', 'address', 'balance', 'transactions', 'received', 'spent', 'output_count', 'unspent_output_count')
        extra_kwargs = {'balance': {'required': False}, 'received': {'required': False}, 'spent': {'required': False}, 'output_count': {'required': False}, 'unspent_output_count': {'required': False}}


    def create(self, validated_data):
        cryptocurrency = validated_data['cryptocurrency']
        crypto_wallet_service = CryptoWalletService(cryptocurrency, validated_data['address'])
        if crypto_wallet_service.type is None:
            raise serializers.ValidationError({'address': ["the cryptocurrency address could not be found."]})

        crypto_wallet = CryptoWallet.objects.create(
            **validated_data,
            balance=normalise_value(cryptocurrency, crypto_wallet_service.balance),
            received=normalise_value(cryptocurrency, crypto_wallet_service.received),
            spent=normalise_value(cryptocurrency, crypto_wallet_service.spent),
            output_count=crypto_wallet_service.output_count,
            unspent_output_count=crypto_wallet_service.unspent_output_count,
        )
        crypto_wallet.save()

        for transaction in crypto_wallet_service.transactions:
            crypto_wallet_transaction = CryptoWalletTransaction.objects.create(
                crypto_wallet=crypto_wallet,
                value=normalise_value(cryptocurrency, transaction['balance_change']),
                time=get_timestamp(transaction['time'])
            )
            crypto_wallet_transaction.save()

        return crypto_wallet