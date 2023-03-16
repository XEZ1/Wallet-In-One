from django.test import TestCase
from unittest.mock import patch, MagicMock

from crypto_exchanges.services import *


class TestBinanceFetcher(TestCase):

    def setUp(self):
        self.api_key = "test_api_key"
        self.secret_key = "test_secret_key"
        self.fetcher = BinanceFetcher(api_key=self.api_key, secret_key=self.secret_key)

    @patch("crypto_exchanges.fetchers.time")
    def test_get_current_time(self, mock_time):
        mock_time.time.return_value = 1615256702.123456
        self.assertEqual(self.fetcher.get_current_time(), 1615256702123)

    def test_prehash(self):
        timestamp = "1615256702123"
        method = "GET"
        path = "/api/v3/account"
        body = None
        expected = "1615256702123GET/api/v3/account"
        self.assertEqual(self.fetcher.prehash(timestamp, method, path, body), expected)

    def test_hash(self):
        timestamp = "1615256702123"
        expected = "7e0a5858c5d9e5d087e5e5dbd6478d5d5f5c5fb2b1dbf73a72e7d319c32ef13"
        self.assertEqual(self.fetcher.hash(timestamp), expected)

    @patch("crypto_exchanges.fetchers.requests.get")
    def test_get_account_data(self, mock_get):
        expected = {"balances": [{"asset": "BTC", "free": "0.01", "locked": "0.00"}, {"asset": "ETH", "free": "0.10",
                                                                                      "locked": "0.00"}]}
        mock_response = MagicMock()
        mock_response.json.return_value = expected
        mock_get.return_value = mock_response

        actual = self.fetcher.get_account_data()

        mock_get.assert_called_once_with(url="https://api.binance.com/api/v3/account?timestamp=1615256702123&signature="
        "7e0a5858c5d9e5d087e5e5dbd6478d5d5f5c5fb2b1dbf73a72e7d319c32ef13", headers={'X-MBX-APIKEY': self.api_key})
        self.assertEqual(actual, expected)

    @patch("crypto_exchanges.fetchers.requests.get")
    def test_get_trading_history(self, mock_get):
        expected = {
            "BTCUSDT": [{"id": 12345, "price": "56000", "qty": "0.1", "commission": "0.05"}, {"id": 67890, "price": "58000", "qty": "0.05", "commission": "0.025"}],
            "ETHUSDT": [{"id": 123, "price": "1800", "qty": "1.0", "commission": "0.01"}, {"id": 456, "price": "1900", "qty": "0.5", "commission": "0.005"}],