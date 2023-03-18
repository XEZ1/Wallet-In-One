"""Tests for the graph data view."""
from django.contrib.auth.models import User
from django.test import TestCase, RequestFactory
from rest_framework.test import APIClient, APIRequestFactory
from django.urls import reverse
from accounts.views import graph_data
from accounts.models import User
from banking.models import Account, Transaction
from rest_framework import status
from django.utils import timezone
from banking.tests.helpers import disable_updates

class GraphDataViewTestCase(TestCase):
    """Tests for the graph data view."""

    fixtures = [
        'accounts/fixtures/user.json',
        'banking/tests/fixtures/bank_data.json',
    ]

    def setUp(self):
        disable_updates()
        self.factory = RequestFactory()
        self.client = APIClient()
        self.url = reverse('graph_data')

    def test_url(self):
        self.assertEqual(self.url,'/graph_data/')

    def test_no_graph_data(self):
        # This user has no accounts connected
        self.user = User.objects.get(id=2)
        self.client.force_authenticate(user=self.user)
        request = self.factory.get(self.url)
        request.user = self.user
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['all']), 0)

    def test_bank_connected(self):
        # This user has a bank account connected
        self.user = User.objects.get(id=1)
        self.client.force_authenticate(user=self.user)
        request = self.factory.get(self.url)
        request.user = self.user
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['all'][0]['x'], 'Banks')
        self.assertEqual(response.data['all'][0]['y'], 100.00)