from django.test import TestCase, Client
from rest_framework.test import APIClient
from django.urls import reverse
from accounts.models import User
from rest_framework import status
from stocks.services import setUpClient
from plaid.model.sandbox_public_token_create_request import SandboxPublicTokenCreateRequest
from plaid.model.products import Products

class BalanceViewTestCase(TestCase):
    fixtures = [
        'stocks/tests/fixtures/user.json',
    ]

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.get(id=3)  
        self.client.force_authenticate(self.user)
        self.url = reverse('get_balance')
        self.access_token = 'access-sandbox-c314b575-cc3d-4897-ae93-c792eb4c2d7c'

    def test_url(self):
        self.assertEqual(self.url,'/stocks/get_balance/')

    def test_response(self):
        body = {'access_token': self.access_token}
        response = self.client.post(self.url, body)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('accounts', response.data)
        self.assertIn('balances', response.data['accounts'][0])
        self.assertIn('current', response.data['accounts'][0]['balances'])

    def test_get_is_not_allowed(self):
        body = {'access_token': self.access_token}
        response = self.client.get(self.url, body)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_invalid_access_token(self):
        body = {'access_token': 'WRONG_ACCESS_TOKEN'}
        response = self.client.post(self.url, body)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['Error']['error_code'], "INVALID_ACCESS_TOKEN")