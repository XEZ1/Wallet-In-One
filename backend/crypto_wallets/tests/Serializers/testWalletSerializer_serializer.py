from django.test import TestCase
from crypto_wallets.seralizers import WalletSerializer
from accounts.models import User
from crypto_wallets.models import CryptoWallet
from django.urls import reverse
from rest_framework.test import APIClient, APIRequestFactory


class WalletSerializerTestCase(TestCase):
    """Unit tests for WalletSerializer class."""

    fixtures = [
        'accounts/fixtures/user.json',
    ]

    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.user = User.objects.get(id=1)
        # form_input = { 'username': '@pickles', 'password': 'Password123%' }
        # self.client.post(self.login_url, form_input, format='json')
        self.transaction = {
            'id': 232,
            'value': 434,
            'time': 45,
        }
        # self.transaction.save()
        self.serializer_input = {
            'user': User.objects.get(username='@pickles'),
            'id':1,
            'cryptocurrency': 'Bitcoin',
            'symbol': 'BTC',
            'address': '0x0',
            'balance': 234,
            'transactions': [self.transaction],
        }

    def test_valid_data_wallet_serializer(self):
        request = APIRequestFactory().post('/')
        request.user = self.user
        serializer = WalletSerializer(data=self.serializer_input, context={'request': request})
        self.assertTrue(serializer.is_valid())
