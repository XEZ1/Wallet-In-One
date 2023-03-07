from rest_framework.test import APIRequestFactory
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
        self.user = User.objects.get(pk='3')
        self.serializer_input = {
            'account_id': '10',
            'access_token': 'test_access_token',
            'user': self.user,
            'name': 'test',
            'institution_id': 'ins_1',
            'institution_name': 'test1',
            'institution_logo': 'test2',
            'balance': 100
        }
        self.stockAccount = StockAccount.objects.create(**self.serializer_input)
        self.serializer = AddStockAccount(instance=self.stockAccount)

    def test_serializer(self):
        data = self.serializer.data
        factory = APIRequestFactory()
        request = factory.get(reverse('add_stock_account'))
        serializer = AddStockAccount(data=data, context={'request': request})
        self.assertTrue(serializer.is_valid())
