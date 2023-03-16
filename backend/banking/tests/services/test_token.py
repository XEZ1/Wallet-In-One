from django.test import TestCase
from banking.services import refresh_access_token, new_refresh_token, generate_tokens, get_access_token
from banking.models import Token
from unittest.mock import patch
from django.utils import timezone

class TokenTestCase(TestCase):
    def test_new_refresh_token(self):
        token = new_refresh_token()
        self.assertIsNotNone(token)
        self.assertIsInstance(token, str)
        self.assertRegex(token, r'^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$')

    @patch('banking.services.credentials', { "secret_id": "", "secret_key": "" })
    def test_new_refresh_token_error(self):
        token = new_refresh_token()
        self.assertIsNone(token)

    @patch('banking.services.credentials', { "secret_id": "", "secret_key": "" })
    def test_generate_token(self):
        response = generate_tokens()
        self.assertEqual(response,{'secret_id': ['This field may not be blank.'], 'secret_key': ['This field may not be blank.'], 'status_code': 400})
    
    def test_refresh_access_token(self):
        response = refresh_access_token('token')
        self.assertEqual(response,{'summary': 'Invalid token', 'detail': 'Token is invalid or expired', 'status_code': 401})

    def test_get_access_token(self):
        t = Token(refresh_token="48nc89q4",access_token="uch8qb91",refresh_token_expiration=timezone.now(),access_token_expiration=timezone.now())
        t.save()

        token = get_access_token(True)
        self.assertIsNotNone(token)
        self.assertIsInstance(token, str)
        self.assertRegex(token, r'^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$')

        # t.set_access_expiry(86400)
        # token = get_access_token(True)