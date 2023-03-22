from django.test import TestCase
from unittest.mock import patch, MagicMock, ANY
from crypto_exchanges.services import *


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

