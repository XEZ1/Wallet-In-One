from django.test import TestCase
from unittest.mock import patch, MagicMock

from crypto_exchanges.services import *


class TestGenericExchangeFetcher(TestCase):
    def setUp(self):
        self.api_key = ""
        self.secret_key = ""
        self.fetcher = ExchangeFetcher(api_key=self.api_key, secret_key=self.secret_key)

    def test_get_current_time(self):
        # Test that the method returns an integer with a right value
        current_time = self.fetcher.get_current_time()
        self.assertIsInstance(current_time, int)
        self.assertAlmostEquals(current_time, round(time.time() * 1000))

    def test_prehash(self):
        # Test that the method returns a string with a right value
        timestamp = str(int(time.time()))
        method = 'GET'
        path = '/v1/hello-world/'
        body = None
        prehash = self.fetcher.prehash(timestamp=timestamp, method=method, path=path, body=body)
        self.assertIsInstance(prehash, str)
        self.assertEquals(prehash, timestamp + method.upper() + path + (body or ''))

    def test_hash(self):
        # Test that the method returns a string with a right value
        timestamp = str(int(time.time()))
        hashed = self.fetcher.hash(timestamp=timestamp)
        self.assertIsInstance(hashed, str)
        self.assertEquals(hashed, hmac.new(self.secret_key.encode('utf-8'), timestamp.encode('utf-8'), sha256).hexdigest())

    def test_get_account_data(self):
        # Test that the method raises an error
        with self.assertRaises(NotImplementedError):
            self.fetcher.get_account_data()

    def test_get_trading_history(self):
        # Test that the method raises an error
        with self.assertRaises(NotImplementedError):
            self.fetcher.get_trading_history()

#
    #@patch('requests.get')
    #def test_get_account_data(self, mock_get):
    #    # Test that the method sends a GET request with the correct parameters
    #    mock_response = MagicMock()
    #    mock_response.json.return_value = {'test': 'data'}
    #    mock_get.return_value = mock_response
#
    #    expected_url = "https://api.binance.com/api/v3/account"
    #    expected_headers = {'X-MBX-APIKEY': self.api_key}
    #    expected_timestamp = str(self.fetcher.get_current_time())
    #    expected_signature = self.fetcher.hash(timestamp=f"timestamp={expected_timestamp}")
    #    expected_params = {'timestamp': expected_timestamp, 'signature': expected_signature}
#
    #    self.fetcher.get_account_data()
#
    #    mock_get.assert_called_with(url=expected_url, headers=expected_headers, params=expected_params)
#
    #@patch('requests.get')
    #def test_get_trading_history(self, mock_get):
    #    # Test that the method sends a GET request with the correct parameters for each symbol
    #    mock_response = MagicMock()
    #    mock_response.json.return_value = {'test': 'data'}
    #    mock_get.return_value = mock_response
#
    #    expected_url = "https://api.binance.com/api/v3/myTrades"
    #    expected_headers = {'X-MBX-APIKEY': self.api_key}
    #    expected_timestamp = str(self.fetcher.get_current_time())
#
    #    expected_params_btcusdt = {'symbol': 'BTCUSDT', 'timestamp': expected_timestamp}
    #    expected_signature_btcusdt = self.fetcher.signature(expected_params_btcusdt)
    #    expected_params_btcusdt.update({'signature': expected_signature_btcusdt})
#
    #    expected_params_ethusdt = {'symbol': 'ETHUSDT', 'timestamp': expected_timestamp}
    #    expected_signature_ethusdt = self.fetcher.signature(expected_params_ethusdt)
    #    expected_params_ethusdt.update({'signature': expected_signature_ethusdt})
#
    #    expected_params_adausdt = {'symbol': 'ADAUSDT', 'timestamp': expected_timestamp}
    #    expected_signature_adausdt = self.fetcher.signature(expected_params_adausdt)
    #    expected_params_adausdt.update({'signature': expected_signature_adausdt})
#
    #    expected_params_xrpusdt = {'symbol': 'XRPUSDT', 'timestamp': expected_timestamp}
    #    expected_signature_xrpusdt = self.fetcher.signature(expected_params_xrpusdt)