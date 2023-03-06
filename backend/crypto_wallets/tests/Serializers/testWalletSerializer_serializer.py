# from django.test import TestCase
# from crypto_wallets.seralizers import WalletSerializer
# from accounts.models import User
# from crypto_wallets.models import CryptoWallet
# from django.urls import reverse
# from rest_framework.test import APIClient

# class WalletSerializerTestCase(TestCase):
#     """Unit tests for WalletSerializer class."""

#     fixtures = [
#         'accounts/fixtures/user.json',
#     ]

#     def setUp(self):
#         self.client = APIClient()
#         self.login_url = reverse('login')
#         form_input = { 'username': '@pickles', 'password': 'Password123%' }
#         self.client.post(self.login_url, form_input, format='json')
#         self.transaction = {
#             'id': 232,
#             'value': 434,
#             'time': 45,
#         }
#         # self.transaction.save()
#         self.serializer_input = {
#             'user': User.objects.get(username='@pickles'),
#             'id':1,
#             'cryptocurrency': 'Bitcoin',
#             'symbol': 'BTC',
#             'address': '0x0',
#             'balance': 234,
#             'transactions': self.transaction,
#         }

#     def test_valid_data_wallet_serializer(self):
#         serializer = WalletSerializer(data=self.serializer_input, context={'request': self.client.request()})
#         self.assertTrue(serializer.is_valid())