"""
Collection of tests that will be used to test the CryptoWallet model.
"""

from django.test import TestCase
from django.core.exceptions import ValidationError

from accounts.models import User
from crypto_wallets.models import CryptoWallet


class CryptoWalletTestCase(TestCase):
    """
    Unit tests that will be used to test the CryptoWallet model.
    """

    fixtures = [
        'accounts/fixtures/user.json',
    ]

    def setUp(self):
        super(TestCase, self).setUp()
        self.user = User.objects.get(id=1)
        self.crypto_wallet = CryptoWallet(
            user=self.user,
            cryptocurrency="Bitcoin",
            symbol="BTC",
            address="0x0",
            balance=100.00
        )

    def _assert_crypto_wallet_is_valid(self, crypto_wallet):
        try:
            crypto_wallet.full_clean()
        except ValidationError:
            self.fail("Crypto wallet is not valid.")

    def _assert_crypto_wallet_is_invalid(self, crypto_wallet):
        with self.assertRaises(ValidationError):
            crypto_wallet.full_clean()

    """
    Test User
    """

    def test_user_must_not_be_blank(self):
        self.crypto_wallet.user = None
        self._assert_crypto_wallet_is_invalid(self.crypto_wallet)

    """
    Test Cryptocurrency
    """

    """
    Test Symbol
    """

    """
    Test Address
    """

    """
    Test Balance
    """

    def test_amount_must_not_be_blank(self):
        self.crypto_wallet.balance = None
        self._assert_crypto_wallet_is_invalid(self.crypto_wallet)
