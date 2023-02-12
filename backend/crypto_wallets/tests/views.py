"""
Collection of tests that will be used to test the CryptoWallet model.
"""

from django.test import TestCase
from django.core.exceptions import ValidationError

from crypto_wallets.models import CryptoWallet


class CryptoWalletTestCase(TestCase):
    """
    Unit tests that will be used to test the CryptoWallet model.
    """

    def setUp(self):
        super(TestCase, self).setUp()

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
