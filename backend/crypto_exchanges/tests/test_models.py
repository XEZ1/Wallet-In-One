"""
Tests for Token, and crypto account models
"""

from django.test import TestCase
from django.core.exceptions import ValidationError

from accounts.serializers import SignUpSerializer
from accounts.models import User
from crypto_exchanges.models import Token, CryptoExchangeAccount


# Create your tests here.
class TokenModelTestCase(TestCase):
    """Unit tests for the token model"""

    fixtures = ['accounts/fixtures/user.json']

    def setUp(self):
        super(TestCase, self).setUp()

        self.user = User.objects.get(id=1)

        self.crypto_exchange_account = CryptoExchangeAccount(
            user=self.user,
            crypto_exchange_name='Kraken',
            api_key='owibhouibh034985',
            secret_key='oefigno23487h',
        )

        self.crypto_exchange_account.save()

        self.token = Token(user=self.user,
                           crypto_exchange_object=self.crypto_exchange_account,
                           asset="ETH",
                           free_amount="5.2341",
                           locked_amount="0.2134")

    def _assert_token_is_valid(self, token):
        try:
            token.full_clean()
        except ValidationError:
            self.fail("Invalid token")

    def _assert_token_is_invalid(self, token):
        with self.assertRaises(ValidationError):
            token.full_clean()

    def test_token_user_not_blank(self):
        self.token.user = None
        self._assert_token_is_invalid(self.token)

    def test_asset_not_blank(self):
        self.token.asset = None
        self._assert_token_is_invalid(self.token)

    def test_asset_can_be_5_chars(self):
        self.token.asset = 'Q' * 5
        self._assert_token_is_valid(self.token)

    def test_asset_cannot_exceed_5_chars(self):
        self.token.asset = 'Q' * 6
        self._assert_token_is_invalid(self.token)

    def test_free_cannot_be_negative(self):
        self.token.free_amount = -1.0
        self._assert_token_is_invalid(self.token)

    def test_locked_cannot_be_negative(self):
        self.token.locked_amount = -1.0
        self._assert_token_is_invalid(self.token)


class CryptoExchangeAccountModelTestCase(TestCase):
    """Unit tests for the BinanceAccount model"""

    fixtures = ['accounts/fixtures/user.json']

    def setUp(self):
        super(TestCase, self).setUp()

        self.user = User.objects.get(id=2)

        self.crypto_exchange_account = CryptoExchangeAccount(user=self.user,
                                                             crypto_exchange_name="Binance",
                                                             api_key="0x0",
                                                             secret_key="0x0",
                                                             created_at='2006-10-25 14:30:59')

    def _assert_crypto_exchange_account_is_valid(self, crypto_exchange_account):
        try:
            crypto_exchange_account.full_clean()
        except ValidationError:
            self.fail("Invalid token")

    def _assert_crypto_exchange_account_is_invalid(self, crypto_exchange_account):
        with self.assertRaises(ValidationError):
            crypto_exchange_account.full_clean()

    def test_crypto_exchange_account_crypto_exchange_can_equal_255_characters(self):
        self.crypto_exchange_account.crypto_exchange = 'a' * 255
        self._assert_crypto_exchange_account_is_valid(self.crypto_exchange_account)

    def test_crypto_exchange_account_crypto_exchange_cannot_exceed_255_characters(self):
        self.crypto_exchange_account.crypto_exchange_name = 'a' * 256
        self._assert_crypto_exchange_account_is_invalid(self.crypto_exchange_account)

    def test_crypto_exchange_account_user_not_blank(self):
        self.crypto_exchange_account.user = None
        self._assert_crypto_exchange_account_is_invalid(self.crypto_exchange_account)

    def test_crypto_exchange_account_api_key_can_equal_255_characters(self):
        self.crypto_exchange_account.api_key = 'a' * 255
        self._assert_crypto_exchange_account_is_valid(self.crypto_exchange_account)

    def test_crypto_exchange_account_api_key_cannot_exceed_255_characters(self):
        self.crypto_exchange_account.api_key = 'a' * 256
        self._assert_crypto_exchange_account_is_invalid(self.crypto_exchange_account)

    def test_crypto_exchange_account_api_key_cannot_be_blank(self):
        self.crypto_exchange_account.api_key = ''
        self._assert_crypto_exchange_account_is_invalid(self.crypto_exchange_account)

    def test_crypto_exchange_account_secret_key_can_equal_255_characters(self):
        self.crypto_exchange_account.secret_key = 'a' * 255
        self._assert_crypto_exchange_account_is_valid(self.crypto_exchange_account)

    def test_crypto_exchange_account_secret_key_cannot_exceed_255_characters(self):
        self.crypto_exchange_account.secret_key = 'a' * 256
        self._assert_crypto_exchange_account_is_invalid(self.crypto_exchange_account)

    def test_crypto_exchange_account_secret_key_cannot_be_blank(self):
        self.crypto_exchange_account.secret_key = ''
        self._assert_crypto_exchange_account_is_invalid(self.crypto_exchange_account)

    def test_crypto_exchange_account_created_at_field_in_datetime_format(self):
        self.crypto_exchange_account.created_at = '2006/03-02'
        self._assert_crypto_exchange_account_is_invalid(self.crypto_exchange_account)
