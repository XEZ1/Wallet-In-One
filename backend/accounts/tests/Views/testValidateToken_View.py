"""Tests for the token validation"""
from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from rest_framework import status
from django.urls import reverse
from accounts.views import validate_token
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ErrorDetail

class ValidateTokenTests(APITestCase):
    """Tests for the token validation"""

    def test_valid_token(self):
        factory = APIRequestFactory()
        request = factory.get(reverse('validate_token'))
        response = validate_token(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {'detail': ErrorDetail(string='Authentication credentials were not provided.', code='not_authenticated')})

    #TODO: ADD MORE TESTS FOR THE TOKEN VALIDATION