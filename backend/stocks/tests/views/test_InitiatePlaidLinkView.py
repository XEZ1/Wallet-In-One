from django.test import TestCase, Client
from rest_framework.test import APIClient
from django.urls import reverse
from accounts.models import User
from rest_framework import status

class InitiatePlaidLinkTestCase(TestCase):
    
    fixtures = [
        'stocks/tests/fixtures/user.json',
    ]

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.get(id=3)  
        self.client.force_authenticate(self.user)
        self.url = reverse('initiate_plaid_link')

    def test_url(self):
        self.assertEqual(self.url,'/stocks/initiate_plaid_link/')

    def test_response(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('link_token', response.data)

    def test_get_is_not_allowed(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
