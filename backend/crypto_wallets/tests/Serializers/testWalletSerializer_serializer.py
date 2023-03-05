# from django.test import TestCase
# from crypto_wallets.seralizers import WalletSerializer
# from accounts.models import User
# from crypto_wallets.models import CryptoWallet

# class WalletSerializerTestCase(TestCase):
#     """Unit tests for WalletSerializer class."""

#     fixtures = [
#         'accounts/fixtures/user.json',
#     ]

#     def setUp(self):
#         self.user = User.objects.get(id=1)
#         self.transaction = {
#             'id': 232,
#             'value': 434,
#             'time': 45,
#         }
#         self.serializer_input = {
#             'user': self.user,
#             'id':1,
#             'cryptocurrency': 'Bitcoin',
#             'symbol': 'BTC',
#             'address': '0x0',
#             'balance': 234,
#             'transactions': self.transaction,
#         }

#     def test_valid_data_wallet_serializer(self):
#         serializer = WalletSerializer(data=self.serializer_input)
#         self.assertTrue(serializer.is_valid())