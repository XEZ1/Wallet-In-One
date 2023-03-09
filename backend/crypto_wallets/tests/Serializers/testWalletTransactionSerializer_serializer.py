"""Wallet Transaction serializer unit tests"""
from django.test import TestCase
from rest_framework import serializers
from crypto_wallets.seralizers import WalletTransactionSerializer

class WalletTransactionSerializerTestCase(TestCase):
    """Wallet Transaction serializer unit tests"""

    def setUp(self):
        self.serializer_input = {
            'id': 232,
            'value': 434,
            'time': 45,
        }

    def test_valid_data_wallet_transaction_serializer(self):
        serializer = WalletTransactionSerializer(data=self.serializer_input)
        self.assertTrue(serializer.is_valid())

    def test_necessary_fields_in_sign_up_serializer(self):
        serializer = WalletTransactionSerializer()
        self.assertIn('id', serializer.fields)
        self.assertIn('value', serializer.fields)
        self.assertIn('time', serializer.fields)

    def test_form_uses_model_validation(self):
        self.serializer_input['time'] = 'badtime'
        serializer = WalletTransactionSerializer(data=self.serializer_input)
        self.assertFalse(serializer.is_valid())