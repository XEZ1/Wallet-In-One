"""Tests of the sign up view."""
from django.contrib.auth.hashers import check_password
from django.test import TestCase
from django.urls import reverse
from ..serializers import SignUpSerializer
from ..models import User

class SignUpViewTestCase(TestCase):
    """Tests of the sign up view."""

    def _is_logged_in(self):
        return '_auth_user_id' in self.client.session.keys()

    def setUp(self):
        self.url = reverse('sign_up')
        self.serializer_input = {
            'username': '@user',
            'first_name': 'Name',
            'last_name': 'Lastname',
            'email': 'namelastname@example.org',
            'new_password': 'Password123!',
            'password_confirmation': 'Password123!'
        }

    def test_sign_up_url(self):
        self.assertEqual(self.url,'/sign_up/')