from django.test import TestCase
from unittest.mock import patch, MagicMock, ANY, call
import unittest

from requests.cookies import MockResponse

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

    def test_signature(self):
        # Test that the method raises an error
        with self.assertRaises(NotImplementedError):
            self.fetcher.signature()

    def test_get_account_data(self):
        # Test that the method raises an error
        with self.assertRaises(NotImplementedError):
            self.fetcher.get_account_data()

    def test_get_trading_history(self):
        # Test that the method raises an error
        with self.assertRaises(NotImplementedError):
            self.fetcher.get_trading_history()


class TestBinanceFetcher(TestCase):
    def setUp(self):
        self.api_key = "6wfUdme200CGraSbJhIKHc0rssBeiEJHjb8BVUF3jCiskhkgsbVCMvaozeKLQ70N"
        self.secret_key = "Gbjxj44liYPiC5NHHmJwqaCy8b8LAQTi9jlS9SG2H1YktXM5lCjQ3JVTt7Br1DfC"
        self.fetcher = BinanceFetcher(api_key=self.api_key, secret_key=self.secret_key)

    def tearDown(self):
        patch.stopall()

    def test_init(self):
        self.assertEquals(self.fetcher.api_key, self.api_key)
        self.assertEquals(self.fetcher.secret_key, self.secret_key)
        self.assertEqual(self.fetcher.symbols, ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'XRPUSDT', 'SOLUSDT'])

    @patch('requests.get')
    def test_get_account_data(self, mock_get):
        # Test that the method sends a GET request with the correct parameters
        mock_response = MagicMock()
        mock_response.json.return_value = {'test': 'data'}
        mock_get.return_value = mock_response

        expected_headers = {'X-MBX-APIKEY': self.api_key}
        expected_timestamp = str(self.fetcher.get_current_time())
        expected_signature = self.fetcher.hash(timestamp=f"timestamp={expected_timestamp}")
        expected_url = f"https://api.binance.com/api/v3/account?timestamp={expected_timestamp}" \
                       f"&signature={expected_signature}"

        self.fetcher.get_account_data(f"timestamp={expected_timestamp}")

        mock_get.assert_called_with(url=expected_url, headers=expected_headers)

    def test_get_trading_history_types(self):
        # Call the get_trading_history method
        result = self.fetcher.get_trading_history()

        # Assert that the result is a dictionary with keys matching the symbols in the symbols list
        self.assertIsInstance(result, dict)
        self.assertCountEqual(result.keys(), self.fetcher.symbols)

        # Assert that the values in the dictionary are non-empty lists
        for symbol, trades in result.items():
            self.assertIsInstance(trades, list)
            self.assertTrue(trades)

    @patch('requests.get')
    def test_get_trading_history(self, mock_get):
        class MockResponse:
            def __init__(self, status_code, json_data):
                self.status_code = status_code
                self.json_data = json_data

            def json(self):
                return self.json_data


        expected_headers = {'X-MBX-APIKEY': self.fetcher.api_key}
        expected_timestamp = self.fetcher.get_current_time()
        expected_params_btcusdt = {'symbol': 'BTCUSDT', 'timestamp': expected_timestamp}
        expected_params_ethusdt = {'symbol': 'ETHUSDT', 'timestamp': expected_timestamp}
        expected_params_adausdt = {'symbol': 'ADAUSDT', 'timestamp': expected_timestamp}
        expected_params_xrpusdt = {'symbol': 'XRPUSDT', 'timestamp': expected_timestamp}
        expected_params_solusdt = {'symbol': 'SOLUSDT', 'timestamp': expected_timestamp}
        expected_signature_btcusdt = self.fetcher.signature(expected_params_btcusdt)
        expected_signature_ethusdt = self.fetcher.signature(expected_params_ethusdt)
        expected_signature_adausdt = self.fetcher.signature(expected_params_adausdt)
        expected_signature_xrpusdt = self.fetcher.signature(expected_params_xrpusdt)
        expected_signature_solusdt = self.fetcher.signature(expected_params_solusdt)

        btcusdt_response = [{'symbol': 'BTCUSDT', 'price': '10000', 'qty': '0.5', 'commission': '0.0005'}]
        ethusdt_response = [{'symbol': 'ETHUSDT', 'price': '3000', 'qty': '1', 'commission': '0.001'}]
        adausdt_response = [{'symbol': 'ADAUSDT', 'price': '2', 'qty': '100', 'commission': '0.01'}]
        xrpusdt_response = [{'symbol': 'XRPUSDT', 'price': '1', 'qty': '200', 'commission': '0.02'}]
        solusdt_response = [{'symbol': 'SOLUSDT', 'price': '150', 'qty': '2', 'commission': '0.003'}]

        mock_get.side_effect = [
            MockResponse(status_code=200, json_data=btcusdt_response),
            MockResponse(status_code=200, json_data=ethusdt_response),
            MockResponse(status_code=200, json_data=adausdt_response),
            MockResponse(status_code=200, json_data=xrpusdt_response),
            MockResponse(status_code=200, json_data=solusdt_response)
        ]

        actual_response = self.fetcher.get_trading_history(expected_timestamp)

        expected_response = {
            'BTCUSDT': btcusdt_response,
            'ETHUSDT': ethusdt_response,
            'ADAUSDT': adausdt_response,
            'XRPUSDT': xrpusdt_response,
            'SOLUSDT': solusdt_response
        }

        assert actual_response == expected_response

        mock_get.assert_has_calls([
            call('https://api.binance.com/api/v3/myTrades', headers=expected_headers,
                 params={**expected_params_btcusdt, **{'signature': expected_signature_btcusdt}}),
            call('https://api.binance.com/api/v3/myTrades', headers=expected_headers,
                 params={**expected_params_ethusdt, **{'signature': expected_signature_ethusdt}}),
            call('https://api.binance.com/api/v3/myTrades', headers=expected_headers,
                 params={**expected_params_adausdt, **{'signature': expected_signature_adausdt}}),
            call('https://api.binance.com/api/v3/myTrades', headers=expected_headers,
                 params={**expected_params_xrpusdt, **{'signature': expected_signature_xrpusdt}}),
            call('https://api.binance.com/api/v3/myTrades', headers=expected_headers,
                 params={**expected_params_solusdt, **{'signature': expected_signature_solusdt}}),
                 ])


class TestGateioFetcher(TestCase):
    def setUp(self):
        self.api_key = "4772671c2cdbd350015a07a27a80f466"
        self.secret_key = "8fa1cc672fc070ead7d1ed4428d1caf454b37248ada8d93e13ccf3f52e7e01fa"
        self.fetcher = GateioFetcher(api_key=self.api_key, secret_key=self.secret_key)
        self.mock_signature = patch('crypto_exchanges.services.GateioFetcher.signature').start()
        self.mock_signature.return_value = {'KEY': self.api_key, 'Timestamp': '123', 'SIGN': 'abc'}

    def tearDown(self):
        patch.stopall()

    def test_init(self):
        self.assertEquals(self.fetcher.api_key, self.api_key)
        self.assertEquals(self.fetcher.secret_key, self.secret_key)
        self.assertEqual(self.fetcher.symbols, ['BTC_USDT', 'ETH_USDT', 'ADA_USDT', 'XRP_USDT', 'SOL_USDT', 'ARV_USDT'])
        self.assertEquals(self.fetcher.host, 'https://api.gateio.ws')
        self.assertEquals(self.fetcher.prefix, '/api/v4')
        self.assertEquals(self.fetcher.headers, {'Accept': 'application/json', 'Content-Type': 'application/json'})

    @patch('requests.get')
    def test_get_account_data(self, mock_get):
        mock_signature = self.mock_signature
        expected_result = {'result': 'success'}
        mock_signature.return_value = {'KEY': self.api_key, 'Timestamp': '123', 'SIGN': 'abc'}
        mock_get.return_value = MagicMock(status_code=200, json=MagicMock(return_value=expected_result))

        result = self.fetcher.get_account_data()

        mock_signature.assert_called_once_with('GET', self.fetcher.prefix + '/spot/accounts', '')
        mock_get.assert_called_once_with(self.fetcher.host + self.fetcher.prefix + '/spot/accounts',
                                         headers={'Accept': 'application/json', 'Content-Type': 'application/json',
                                                  'KEY': self.api_key, 'Timestamp': '123', 'SIGN': 'abc'})
        self.assertEqual(result, expected_result)

    def test_get_trading_history_types(self):
        # Call the get_trading_history method
        result = self.fetcher.get_trading_history()

        # Assert that the result is a dictionary with keys matching the symbols in the symbols list
        self.assertIsInstance(result, dict)
        self.assertCountEqual(result.keys(), self.fetcher.symbols)

        # Assert that the values in the dictionary are non-empty lists
        for symbol, trades in result.items():
            self.assertIsInstance(trades, list)
            self.assertTrue(trades)

    @patch('requests.get')
    def test_get_trading_history(self, mock_get):
        expected_result = {
            'BTC_USDT': {'result': 'success'},
            'ETH_USDT': {'result': 'success'},
            'ADA_USDT': {'result': 'success'},
            'XRP_USDT': {'result': 'success'},
            'SOL_USDT': {'result': 'success'},
            'ARV_USDT': {'result': 'success'},
        }
        mock_signature = self.mock_signature
        mock_signature.return_value = {'KEY': self.api_key, 'Timestamp': '123', 'SIGN': 'abc'}
        mock_get.return_value = MagicMock(status_code=200, json=MagicMock(return_value={'result': 'success'}))

        result = self.fetcher.get_trading_history()

        mock_signature.assert_any_call('GET', self.fetcher.prefix + '/spot/trades?currency_pair=BTC_USDT&limit=10')
        mock_signature.assert_any_call('GET', self.fetcher.prefix + '/spot/trades?currency_pair=ETH_USDT&limit=10')
        mock_signature.assert_any_call('GET', self.fetcher.prefix + '/spot/trades?currency_pair=ADA_USDT&limit=10')
        mock_signature.assert_any_call('GET', self.fetcher.prefix + '/spot/trades?currency_pair=XRP_USDT&limit=10')
        mock_signature.assert_any_call('GET', self.fetcher.prefix + '/spot/trades?currency_pair=SOL_USDT&limit=10')
        mock_signature.assert_any_call('GET', self.fetcher.prefix + '/spot/trades?currency_pair=ARV_USDT&limit=10')
        assert mock_signature.call_count == 6

        mock_get.assert_any_call(
            self.fetcher.host + self.fetcher.prefix + '/spot/trades?currency_pair=BTC_USDT&limit=10',
            headers={'Accept': 'application/json', 'Content-Type': 'application/json', 'KEY': self.api_key,
                     'Timestamp': '123', 'SIGN': 'abc'})
        mock_get.assert_any_call(
            self.fetcher.host + self.fetcher.prefix + '/spot/trades?currency_pair=ETH_USDT&limit=10',
            headers={'Accept': 'application/json', 'Content-Type': 'application/json', 'KEY': self.api_key,
                     'Timestamp': '123', 'SIGN': 'abc'})
        mock_get.assert_any_call(
            self.fetcher.host + self.fetcher.prefix + '/spot/trades?currency_pair=ADA_USDT&limit=10',
            headers={'Accept': 'application/json', 'Content-Type': 'application/json', 'KEY': self.api_key,
                     'Timestamp': '123', 'SIGN': 'abc'})
        mock_get.assert_any_call(
            self.fetcher.host + self.fetcher.prefix + '/spot/trades?currency_pair=XRP_USDT&limit=10',
            headers={'Accept': 'application/json', 'Content-Type': 'application/json', 'KEY': self.api_key,
                     'Timestamp': '123', 'SIGN': 'abc'})
        mock_get.assert_any_call(
            self.fetcher.host + self.fetcher.prefix + '/spot/trades?currency_pair=SOL_USDT&limit=10',
            headers={'Accept': 'application/json', 'Content-Type': 'application/json', 'KEY': self.api_key,
                     'Timestamp': '123', 'SIGN': 'abc'})
        mock_get.assert_any_call(
            self.fetcher.host + self.fetcher.prefix + '/spot/trades?currency_pair=ARV_USDT&limit=10',
            headers={'Accept': 'application/json', 'Content-Type': 'application/json', 'KEY': self.api_key,
                     'Timestamp': '123', 'SIGN': 'abc'})


class TestCoinListFetcher(TestCase):
    def setUp(self):
        self.api_key = "3ad7fce8-815b-4371-8671-95571c1c7666"
        self.secret_key = "q6onPwTnucwK6YWbK3JWa5fyQ7G46uP5ef2uoTLJ4vo+urPapDwbtvzY4UNhJjieE+0a3+K9gN7vFXtPIkFUhg=="
        self.fetcher = CoinListFetcher(api_key=self.api_key, secret_key=self.secret_key)

    def tearDown(self):
        patch.stopall()

    def test_init(self):
        self.assertEquals(self.fetcher.api_key, self.api_key)
        self.assertEquals(self.fetcher.secret_key, self.secret_key)

    @patch('requests.get')
    def test_get_account_data(self, mock_get):
        # Mock the response
        mock_response = MagicMock()
        mock_response.json.return_value = {"accounts": [{"trader_id": "1234"}, {"trader_id": "5678"}]}
        mock_get.return_value = mock_response

        # Call the method
        result = self.fetcher.get_account_data()
        self.assertEqual(len(result), 1)

        # Check that requests.get was called with the correct arguments
        mock_get.assert_any_call(
            url="https://trade-api.coinlist.co/v1/accounts/",
            headers={
                'Content-Type': 'application/json',
                'CL-ACCESS-KEY': self.api_key,
                'CL-ACCESS-SIG': ANY,
                'CL-ACCESS-TIMESTAMP': ANY
            }
        )

        # Check the result
        self.assertEqual(result,  {'accounts': [{'trader_id': '1234'}, {'trader_id': '5678'}]})

    def test_get_trading_history_types(self):
        # Call the get_trading_history method
        result = self.fetcher.get_trading_history()

        # Assert that the result is a dictionary with keys matching the symbols in the symbols list
        self.assertIsInstance(result, dict)

        # Assert that the values in the dictionary are non-empty lists
        for symbol, trades in result.items():
            self.assertIsInstance(trades, list)
            self.assertTrue(trades)

    @patch('requests.get')
    def test_get_trading_history(self, mock_get):
        # Set up mock response
        mock_response = MagicMock()
        mock_response.json.return_value = [
            {'symbol': 'BTC', 'amount': '1.00000000', 'type': 'deposit'},
            {'symbol': 'ETH', 'amount': '2.00000000', 'type': 'withdrawal'}
        ]
        mock_get.return_value = mock_response

        # Call method and assert results
        result = self.fetcher.get_trading_history()
        self.assertEqual(len(result), 2)

    @patch('requests.get')
    def test_get_trading_history2(self, mock_get):
        class MockResponse:
            def __init__(self, json_data, status_code):
                self.status_code = status_code
                self.json_data = json_data

            def json(self):
                return self.json_data

        mock_get.side_effect = [
            # Response for getting account IDs
            MockResponse({
                'accounts': [
                    {'trader_id': '123'},
                    {'trader_id': '456'}
                ]
            }, 200),
            # Response for getting trading history for account ID 123
            MockResponse({
                'history': [
                    {'id': '123-1', 'timestamp': ANY, 'amount': '10.0', 'currency': 'BTC'},
                ]
            }, 200),
            # Response for getting trading history for account ID 456
            MockResponse({
                'history': [
                    {'id': '456-1', 'timestamp': ANY, 'amount': '100.0', 'currency': 'BTC'}
                ]
            }, 200)
        ]

        # Call the get_trading_history method
        trading_history = self.fetcher.get_trading_history()

        expected_result = {
            'history': [
                {
                    'id': '456-1',
                    'timestamp': ANY,
                    'amount': '100.0',
                    'currency': 'BTC'
                },
            ]
        }

        # Sort the trading history in the expected result
        # expected_result['history'].sort(key=lambda x: x['id'])

        # Assert that the response has the expected data
        self.assertEqual(trading_history, expected_result)

        # Assert that requests.get was called with the expected parameters
        mock_get.assert_has_calls([
            call(url='https://trade-api.coinlist.co/v1/accounts/', headers=ANY),
            call(url='https://trade-api.coinlist.co/v1/accounts/123/ledger', headers=ANY),
            call(url='https://trade-api.coinlist.co/v1/accounts/456/ledger', headers=ANY)
        ])
