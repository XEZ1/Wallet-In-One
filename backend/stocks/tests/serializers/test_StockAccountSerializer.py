from rest_framework.test import APIRequestFactory, APIClient
from stocks.serializers import AddStockAccount
from stocks.models import StockAccount
from rest_framework.request import Request
from djmoney.money import Money
from accounts.models import User
from django.test import TestCase
from django.urls import reverse

class StockAccountSerializerTestCase(TestCase):

    fixtures = [
        'stocks/tests/fixtures/stocks.json',
        'stocks/tests/fixtures/user.json',
    ]

    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.user = User.objects.get(pk='3')
        self.client.force_authenticate(self.user)
        self.serializer_input = {
            'account_id': '10',
            'access_token': 'test_access_token',
            'name': 'test',
            'institution_id': 'ins_1',
            'institution_name': 'test1',
            'institution_logo': 'test2',
            'balance': Money(100, 'GBP')
        }

    def test_serializer(self):
        factory = APIRequestFactory()
        request = factory.post('/')
        request.user = self.user
        serializer = AddStockAccount(data=self.serializer_input, context={'request': request})
        self.assertTrue(serializer.is_valid())
