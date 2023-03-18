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
        self.user = User.objects.get(id=1)
        disable_updates()
        self.factory = RequestFactory()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.url = reverse('graph_data')

    def test_url(self):
        self.assertEqual(self.url,'/graph_data/')

    def test_no_graph_data(self):
        request = self.factory.get(self.url)
        request.user = self.user
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['all']), 0)

    def test_bank_connected(self):
        request = self.factory.get(self.url)
        request.user = self.user
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # self.assertEqual(response.data['all'][0]['x'], 'Banks')
        # self.assertEqual(response.data['all'][0]['y'], 0)
        # self.assertEqual(response.data['all'][1]['x'], 'Cryptocurrency from wallets')
        # self.assertEqual(response.data['all'][1]['y'], 0)
        # self.assertEqual(response.data['all'][2]['x'], 'Stock Accounts')
        # self.assertEqual(response.data['all'][2]['y'], 0)
        # self.assertEqual(response.data['all'][3]['x'], 'Cryptocurrency from exchanges')
        # self.assertEqual(response.data['all'][3]['y'], 0)