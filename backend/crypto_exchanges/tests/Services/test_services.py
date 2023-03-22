from django.test import TestCase
from unittest.mock import patch, MagicMock, ANY, call
from crypto_exchanges.services import *
from accounts.models import *


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
        self.assertEquals(hashed,
                          hmac.new(self.secret_key.encode('utf-8'), timestamp.encode('utf-8'), sha256).hexdigest())

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

    def test_signature(self):
        params = {}
        query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        expexted_value = hmac.new(self.secret_key.encode('utf-8'), query_string.encode('utf-8'), sha256).hexdigest()
        self.assertEquals(self.fetcher.signature({}), expexted_value)

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

    def test_signature(self):
        self.tearDown()

        method = 'GET'
        url = 'v1'
        query_string = None
        payload_string = None
        timestamp = str(time.time())
        message = sha512()
        message.update((payload_string or "").encode('utf-8'))
        hashed_payload = message.hexdigest()
        path = '%s\n%s\n%s\n%s\n%s' % (method, url, query_string or "", hashed_payload, timestamp)
        signature = hmac.new(self.secret_key.encode('utf-8'), path.encode('utf-8'), sha512).hexdigest()

        expected_result = {'KEY': self.api_key, 'Timestamp': timestamp, 'SIGN': signature}
        actual_result = self.fetcher.signature(method, url, None, None, timestamp=timestamp)

        self.assertEquals(actual_result, expected_result)

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

    def test_signature(self):
        timestamp = str(int(time.time()))
        path = '/v1/accounts/'
        method = 'GET'
        body = None

        data = self.fetcher.prehash(timestamp, method, path, body)
        key = b64decode(self.secret_key)

        hmc = hmac.new(key, data.encode('utf-8'), digestmod=sha256)
        expected_result = b64encode(hmc.digest()).decode('utf-8')

        self.assertEquals(self.fetcher.signature(data, key), expected_result)

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
        self.assertEqual(result, {'accounts': [{'trader_id': '1234'}, {'trader_id': '5678'}]})

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


class TestCoinBaseFetcher(TestCase):
    def setUp(self):
        self.api_key = "Lt4fELfkTX1Oif0y"
        self.secret_key = "Jt2nHesybO3Wx8pgWUXlxr3hHZiqgDKu"
        self.fetcher = CoinBaseFetcher(api_key=self.api_key, secret_key=self.secret_key)

    def tearDown(self):
        patch.stopall()

    def test_init(self):
        self.assertEquals(self.fetcher.api_key, self.api_key)
        self.assertEquals(self.fetcher.secret_key, self.secret_key.encode('utf-8'))

    def test_call_method(self):
        # Create a mock request object
        request = MagicMock()
        request.method = 'GET'
        request.path_url = '/v1/accounts/'
        request.body = None
        request.headers = {}

        # Create an instance of the class being tested
        instance = CoinBaseFetcher(self.api_key, self.secret_key)

        # Call the __call__ method
        response = instance(request)

        # Assert that the headers were updated correctly
        expected_signature = instance.signature(str(int(time.time())) + request.method + request.path_url)
        self.assertEqual(request.headers['CB-ACCESS-SIGN'], expected_signature)
        self.assertEqual(request.headers['CB-ACCESS-TIMESTAMP'], str(int(time.time())))
        self.assertEqual(request.headers['CB-ACCESS-KEY'], self.api_key)

    def test_signature(self):
        message = str(int(time.time())) + 'GET' + 'v1/accounts' + ''
        expected_result = hmac.new(self.secret_key.encode('utf-8'), message.encode(), sha256).hexdigest()

        self.assertEquals(self.fetcher.signature(message), expected_result)

    @patch('requests.get')
    def test_get_account_data(self, mock_get):
        # Set up mock response from Coinbase API
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'data': [
                {
                    'balance': '100.0',
                    'currency': 'BTC',
                },
                {
                    'balance': '200.0',
                    'currency': 'ETH',
                },
            ]
        }
        mock_get.return_value = mock_response

        # Call the method being tested
        account_data = self.fetcher.get_account_data()

        # Verify that requests.get() was called with the correct parameters
        mock_get.assert_called_once_with(
            'https://api.coinbase.com/v2/accounts',
            auth=self.fetcher
        )

        # Verify that the expected data was returned
        self.assertEqual(account_data, ['100.0', '200.0'])

    @patch('requests.get')
    def test_get_trading_history(self, mock_get):
        # Set up mock response from Coinbase API
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'data': [
                {
                    'id': '123',
                    'product_id': 'BTC-USD',
                    'size': '1.0',
                    'price': '50000.0',
                    'side': 'buy',
                },
                {
                    'id': '456',
                    'product_id': 'ETH-USD',
                    'size': '2.0',
                    'price': '2000.0',
                    'side': 'sell',
                },
            ]
        }
        mock_get.return_value = mock_response

        # Call the method being tested
        trading_history = self.fetcher.get_trading_history()

        # Verify that requests.get() was called with the correct parameters
        mock_get.assert_called_once_with(
            'https://api.coinbase.com/api/v3/brokerage/orders/historical/fills',
            auth=self.fetcher,
        )

        # Verify that the expected data was returned
        self.assertEqual(trading_history['data'][0]['id'], '123')
        self.assertEqual(trading_history['data'][0]['product_id'], 'BTC-USD')
        self.assertEqual(trading_history['data'][0]['size'], '1.0')
        self.assertEqual(trading_history['data'][0]['price'], '50000.0')
        self.assertEqual(trading_history['data'][0]['side'], 'buy')

        self.assertEqual(trading_history['data'][1]['id'], '456')
        self.assertEqual(trading_history['data'][1]['product_id'], 'ETH-USD')
        self.assertEqual(trading_history['data'][1]['size'], '2.0')
        self.assertEqual(trading_history['data'][1]['price'], '2000.0')
        self.assertEqual(trading_history['data'][1]['side'], 'sell')


class TestKrakenFetcher(TestCase):
    def setUp(self):
        self.api_key = "n0A6PzkvLERMZIigVv3dCSRLP53+MI+Fbj38hpfgI9zpt0v1WH6P7vww"
        self.secret_key = "STpUie82GH24tsvnYYTB+cWN9MTTlhTO0GR3uSfCKwQVpmfcp9A67YN9Asx0m3sOBMRq6HXtW/ktM042CVItyQ=="
        self.fetcher = KrakenFetcher(api_key=self.api_key, secret_key=self.secret_key)

    def tearDown(self):
        patch.stopall()

    def test_init(self):
        self.assertEquals(self.fetcher.api_key, self.api_key)
        self.assertEquals(self.fetcher.secret_key, self.secret_key)

    def test_signature(self):
        urlpath = '/0/private/Balance'
        data = {"nonce": str(int(1000 * time.time()))}

        post_data = urlencode(data)
        encoded = (str(data['nonce']) + post_data).encode()
        message = urlpath.encode() + sha256(encoded).digest()
        mac = hmac.new(b64decode(self.secret_key), message, sha512)
        sig_digest = b64encode(mac.digest())
        expected_result = sig_digest.decode()

        self.assertEquals(self.fetcher.signature(urlpath, data, self.secret_key), expected_result)

    @patch('requests.post')
    def test_get_account_data(self, mock_post):
        url = 'https://api.kraken.com'
        path = '/0/private/Balance'
        timestamp = {"nonce": str(int(1000 * time.time()))}

        # Mock the requests library to return a response with a known JSON payload
        mock_response = MagicMock()
        mock_response.json.return_value = {'result': {'XXBT': '10.12345678', 'ZUSD': '1000.00'}}
        mock_post.return_value = mock_response

        # Call the method being tested
        account_data = self.fetcher.get_account_data()

        # Check that the mocked request was made with the expected arguments
        mock_post.assert_called_once_with(
            'https://api.kraken.com/0/private/Balance',
            headers={'API-Key': self.api_key, 'API-Sign': ANY,
                     'Content-Type': 'application/x-www-form-urlencoded'},
            data={'nonce': ANY}
        )

        # Check that the method returns the expected account data
        expected_data = {'result': {'XXBT': '10.12345678', 'ZUSD': '1000.00'}}
        self.assertEqual(account_data, expected_data)

    @patch('requests.post')
    def test_get_trading_history(self, mock_post):
        # Mock the requests library to return a response with a known JSON payload
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'result': {'trades': [{'id': '123', 'price': '100.00'}, {'id': '456', 'price': '99.50'}]}}
        mock_post.return_value = mock_response

        # Call the method being tested
        trading_history = self.fetcher.get_trading_history()

        # Check that the mocked request was made with the expected arguments
        mock_post.assert_called_once_with(
            'https://api.kraken.com/0/private/TradesHistory',
            headers=ANY,
            data={'nonce': ANY}
        )

        # Check that the method returns the expected trading history data
        expected_data = {'result': {'trades': [{'id': '123', 'price': '100.00'}, {'id': '456', 'price': '99.50'}]}}
        self.assertEqual(trading_history, expected_data)


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
