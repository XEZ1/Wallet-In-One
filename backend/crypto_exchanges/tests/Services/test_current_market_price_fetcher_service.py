from django.test import TestCase
from unittest.mock import patch
from crypto_exchanges.services import *
from accounts.models import *


class TestCurrentMarketPriceFetcher(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user('testuser', 'test@example.com', 'password')

    def setUp(self):
        self.fetcher = CurrentMarketPriceFetcher(self.user)
        self.market_fetcher = CurrentMarketPriceFetcher(self.user)

        # Create a crypto exchange account for the user
        self.exchange = CryptoExchangeAccount.objects.create(
            user=self.user,
            crypto_exchange_name='Test Exchange',
            api_key='api_key',
            secret_key='secret_key'
        )

        # Create some tokens for the exchange
        self.token1 = Token.objects.create(
            user=self.user,
            crypto_exchange_object=self.exchange,
            asset='BTC',
            free_amount=1.0,
            locked_amount=0.0
        )
        self.token2 = Token.objects.create(
            user=self.user,
            crypto_exchange_object=self.exchange,
            asset='ETH',
            free_amount=2.0,
            locked_amount=0.5
        )

    @patch('requests.get')
    def test_get_crypto_price(self, mock_get):
        # Test case for when response contains GBP key
        mock_get.return_value.json.return_value = {'GBP': 123.45}
        price = self.fetcher.get_crypto_price('BTC')
        self.assertEqual(price, float('123.45'))

        # Test case for when response does not contain GBP key
        mock_get.return_value.json.return_value = {}
        price = self.fetcher.get_crypto_price('BTC')
        self.assertEqual(price, float('0.0'))

    @patch('crypto_exchanges.services.CurrentMarketPriceFetcher.get_crypto_price')
    def test_total_user_balance_crypto(self, mock_get_crypto_price):
        # Mock the get_crypto_price method to return fixed prices
        mock_get_crypto_price.side_effect = lambda asset: 10000.0 if asset == 'BTC' else 200.0

        # Calculate the expected total balance
        expected_balance = (10000.0 * (1.0 + 0.0)) + (200.0 * (2.0 + 0.5))

        # Call the method being tested
        actual_balance = self.market_fetcher.total_user_balance_crypto()

        # Assert that the result matches the expected balance
        self.assertAlmostEqual(actual_balance, expected_balance, places=2)

    @patch('crypto_exchanges.services.CurrentMarketPriceFetcher.get_crypto_price')
    def test_chart_breakdown_crypto_free(self, mock_get_crypto_price):
        # Mock the get_crypto_price method to return fixed prices
        mock_get_crypto_price.side_effect = lambda asset: 10000.0 if asset == 'BTC' else 200.0

        # Call the method being tested
        breakdown = self.market_fetcher.chart_breakdown_crypto_free()

        # Assert that the breakdown has the expected format and values
        expected_breakdown = [{'x': 'BTC', 'y': 10000.0}, {'x': 'ETH', 'y': 400.0}]
        self.assertEqual(breakdown, expected_breakdown)

    @patch('crypto_exchanges.services.CurrentMarketPriceFetcher.get_crypto_price')
    def test_chart_breakdown_crypto_locked(self, mock_get_crypto_price):
        # Mock the get_crypto_price method to return fixed prices
        mock_get_crypto_price.side_effect = lambda asset: 10000.0 if asset == 'BTC' else 200.0

        # Call the method being tested
        breakdown = self.market_fetcher.chart_breakdown_crypto_locked()

        # Assert that the breakdown has the expected format and values
        expected_breakdown = [{'x': 'BTC', 'y': 0.0}, {'x': 'ETH', 'y': 100.0}]
        self.assertEqual(breakdown, expected_breakdown)

    @patch('crypto_exchanges.services.CurrentMarketPriceFetcher.get_crypto_price')
    def test_get_exchange_balance(self, mock_get_crypto_price):
        # Mock the get_crypto_price method to return fixed prices
        mock_get_crypto_price.side_effect = lambda asset: 10000.0 if asset == 'BTC' else 200.0

        # Call the method being tested
        actual_balance = self.market_fetcher.get_exchange_balance(self.exchange)

        # Assert that the result matches the expected balance
        expected_balance = (10000.0 * (1.0 + 0.0)) + (200.0 * (2.0 + 0.5))
        self.assertAlmostEqual(actual_balance, expected_balance, places=2)

    @patch('crypto_exchanges.services.CurrentMarketPriceFetcher.get_crypto_price')
    def test_get_exchange_token_breakdown(self, mock_get_crypto_price):
        # Mock the get_crypto_price method to return fixed prices
        mock_get_crypto_price.side_effect = lambda asset: 10000.0 if asset == 'BTC' else 200.0

        # Call the method being tested
        breakdown = self.market_fetcher.get_exchange_token_breakdown(self.exchange)

        # Assert that the breakdown has the expected format and values
        expected_breakdown = {
            "balance": 10500.0,
            "token_data": [
                {"x": "ETH: £500.0", "y": 500.0},
                {"x": "BTC: £10000.0", "y": 10000.0}
            ]
        }
        self.assertEqual(breakdown, expected_breakdown)

    @patch('crypto_exchanges.services.CurrentMarketPriceFetcher.get_crypto_price')
    def test_chart_breakdown_crypto_exchanges(self, mock_get_crypto_price):
        # Mock the get_crypto_price method to return fixed prices
        mock_get_crypto_price.side_effect = lambda asset: 10000.0 if asset == 'BTC' else 200.0

        # Call the method being tested
        breakdown = self.market_fetcher.chart_breakdown_crypto_exchanges()

        # Assert that the breakdown has the expected format and values
        expected_breakdown = [
            {'x': 'Test Exchange', 'y': 10500.0, 'id': self.exchange.id},
        ]
        self.assertEqual(breakdown, expected_breakdown)

