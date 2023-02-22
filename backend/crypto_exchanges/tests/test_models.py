"""
Tests for Token, and crypto account models
"""

from django.test import TestCase
from django.core.exceptions import ValidationError

from accounts.serializers import SignUpSerializer
from accounts.models import User
from crypto_exchanges.models import Token, BinanceAccount, HuobiAccount, GateioAccount, KrakenAccount


# Create your tests here.
class TokenModelTestCase(TestCase):
    """Unit tests for the token model"""

    fixtures = ['accounts/fixtures/user.json']

    def setUp(self):
        super(TestCase, self).setUp()

        self.user = User.objects.get(id=2)

        self.token = Token(user=self.user,
                           asset="ETH",
                           free="5.2341",
                           locked="0.2134")

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

    def test_asset_can_be_50_chars(self):
        self.token.asset = 'Q' * 50
        self._assert_token_is_valid(self.token)

    def test_asset_cannot_exceed_50_chars(self):
        self.token.asset = 'Q' * 51
        self._assert_token_is_invalid(self.token)

    def test_free_cannot_be_negative(self):
        self.token.free = -1.0
        self._assert_token_is_invalid(self.token)

    def test_locked_cannot_be_negative(self):
        self.token.locked = -1.0
        self._assert_token_is_invalid(self.token)


class BinanceAccountModelTestCase(TestCase):
    """Unit tests for the BinanceAccount model"""

    fixtures = ['accounts/fixtures/user.json']

    def setUp(self):
        super(TestCase, self).setUp()

        self.user = User.objects.get(id=2)

        self.binance_account = BinanceAccount(user=self.user,
                                              api_key="0x0",
                                              secret_key="0x0",
                                              created_at='2006-10-25 14:30:59')

    def _assert_binance_account_is_valid(self, binance_account):
        try:
            binance_account.full_clean()
        except ValidationError:
            self.fail("Invalid token")

    def _assert_binance_account_is_invalid(self, binance_account):
        with self.assertRaises(ValidationError):
            binance_account.full_clean()

    def test_binance_account_user_not_blank(self):
        self.binance_account.user = None
        self._assert_binance_account_is_invalid(self.binance_account)

    def test_binance_account_api_key_can_equal_255_characters(self):
        self.binance_account.api_key = 'a' * 255
        self._assert_binance_account_is_valid(self.binance_account)

    def test_binance_account_api_key_cannot_exceed_255_characters(self):
        self.binance_account.api_key = 'a' * 256
        self._assert_binance_account_is_invalid(self.binance_account)

    def test_binance_account_api_key_cannot_be_blank(self):
        self.binance_account.api_key = ''
        self._assert_binance_account_is_invalid(self.binance_account)

    def test_binance_account_secret_key_can_equal_255_characters(self):
        self.binance_account.secret_key = 'a' * 255
        self._assert_binance_account_is_valid(self.binance_account)

    def test_binance_account_secret_key_cannot_exceed_255_characters(self):
        self.binance_account.secret_key = 'a' * 256
        self._assert_binance_account_is_invalid(self.binance_account)

    def test_binance_account_secret_key_cannot_be_blank(self):
        self.binance_account.secret_key = ''
        self._assert_binance_account_is_invalid(self.binance_account)

    def test_binance_account_created_at_field_in_datetime_format(self):
        self.binance_account.created_at = '2006/03-02'
        self._assert_binance_account_is_invalid(self.binance_account)
