from django.test import TestCase
from unittest.mock import patch
from datetime import datetime
from decimal import Decimal
from collections import defaultdict
from crypto_exchanges.models import *
from accounts.models import *
from crypto_exchanges.services import CurrentMarketPriceFetcher, iso8601_to_datetime, get_most_expensive_transaction


class GetMostExpensiveTransactionTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', first_name='Lesya', last_name='Abakhova',
                                             email='example@hse.edu.ru', password='testpassword')
        self.exchange = CryptoExchangeAccount.objects.create(user=self.user, crypto_exchange_name='Binance')
        self.timestamp = datetime(2022, 1, 1, 0, 0, 0)
        self.transactions = [
            Transaction.objects.create(
                crypto_exchange_object=self.exchange,
                asset='BTC',
                amount=1.0,
                transaction_type='buy',
                timestamp=self.timestamp
            ),
            Transaction.objects.create(
                crypto_exchange_object=self.exchange,
                asset='ETH',
                amount=2.0,
                transaction_type='buy',
                timestamp=self.timestamp
            ),
            Transaction.objects.create(
                crypto_exchange_object=self.exchange,
                asset='BTC',
                amount=0.5,
                transaction_type='sell',
                timestamp=self.timestamp
            ),
        ]
    #@patch('crypto_exchanges.services.CurrentMarketPriceFetcher.get_crypto_price')
    #def test_get_most_expensive_transaction(self, mock_get_crypto_price):
    #    # Set up mock prices for BTC and ETH
    #    mock_get_crypto_price.side_effect = lambda asset: Decimal('10000.00') if asset == 'BTC' else Decimal('500.00')
#
    #    # Call the function and check the result
    #    result = get_most_expensive_transaction(self.user)
#
    #    # Expected result: (asset, amount, price, type, timestamp, exchange_name)
    #    expected = ('BTC', 1.0, 10000.0, 'buy', '2022-01-01 00:00:00', 'binance')
    #    self.assertEqual(result, expected)

    #def test_get_most_expensive_transaction(self):
    #    response = get_most_expensive_transaction(self.user)
    #    self.assertTupleEqual(response, ('ETH', 2.0, 4000.0, 'buy', '2022-01-01 00:00:00', 'Binance'))
#
    #def test_get_most_expensive_transaction_no_transactions(self):
    #    Transaction.objects.all().delete()
    #    response = get_most_expensive_transaction(self.user)
    #    self.assertTupleEqual(response, ('empty', 0.0, 0.0, None, None, None))
#
    #def test_get_most_expensive_transaction_same_max_amount(self):
    #    Transaction.objects.create(
    #        crypto_exchange_object=self.exchange,
    #        asset='ETH',
    #        amount=2.0,
    #        transaction_type='buy',
    #        timestamp=self.timestamp
    #    )
    #    response = get_most_expensive_transaction(self.user)
    #    self.assertTupleEqual(response, ('ETH', 2.0, 4000.0, 'buy', '2022-01-01 00:00:00', 'Binance'))