"""
Collection of tests that will be used to test the CryptoWallet model.
"""

from django.test import TestCase
from django.urls import reverse
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient

from crypto_wallets.models import CryptoWallet


class CryptoWalletTestCase(TestCase):
    """
    Unit tests that will be used to test the CryptoWallet model.
    """

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('crypto_wallets')

    def test_crypto_wallet_url(self):
        self.assertEqual(self.url, '/crypto_wallets/')

    """
    Test Get
    """

    """
    Test Post
    """

    """
    Test Delete
    """
