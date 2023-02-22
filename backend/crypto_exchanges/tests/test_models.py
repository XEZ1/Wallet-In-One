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

    fixtures = ['accounts/fixtures/user.json',]

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

