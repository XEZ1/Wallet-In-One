from datetime import datetime, timezone, timedelta

from django.http import HttpResponse, HttpRequest
from rest_framework.test import APIRequestFactory, force_authenticate, APITestCase, APIClient
from rest_framework.response import Response
from rest_framework.test import APITestCase, APIRequestFactory

from django.contrib.auth.models import User
from django.test import TestCase, Client, RequestFactory
from django.urls import reverse
from rest_framework import status

import unittest
from unittest.mock import MagicMock, patch, Mock

from accounts.models import User
from ...views import get_transactions, get_token_breakdown, get_exchange_balances, GenericCryptoExchanges, \
    UpdateAllTokens, BinanceView, GateioView, CoinListView, CoinBaseView, KrakenView
from ...models import CryptoExchangeAccount, Transaction, Token
from ...services import BinanceFetcher, GateioFetcher, CoinListFetcher, CoinBaseFetcher, KrakenFetcher
from crypto_exchanges.serializers import *
from typing import List, Dict, Any
from collections import OrderedDict

import json


def millis_to_datetime(millis):
    return datetime.fromtimestamp(millis / 1000.0)


def convert_to_dict_list(data: List[OrderedDict]) -> List[Dict[str, Any]]:
    result = []
    for item in data:
        dict_item = {}
        for key, value in item.items():
            dict_item[key] = value
        result.append(dict_item)
    return result


def convert_date_string(date_string):
    dt = datetime.fromisoformat(date_string)
    return dt.strftime('%Y-%m-%dT%H:%M:%S.%fZ')


class TestGetTransactions(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='@user', first_name='Name', last_name='Lastname',
                                             email='namelastname@example.org')
        self.crypto_exchange_account = CryptoExchangeAccount.objects.create(
            user=self.user,
            crypto_exchange_name='Binance',
            api_key='wfeioguhwe549876y43jh',
            secret_key='wfjbh234987trfhu'
        )

    def test_get_transactions(self):
        # create a CryptoExchangeAccount and Transaction objects

        transaction = Transaction.objects.create(
            crypto_exchange_object=self.crypto_exchange_account,
            timestamp=datetime.now(),
            transaction_type="buy",
            amount=1.0,
            asset='BTC'
        )

        transaction.save()

        # create a GET request to get the transactions for the created exchange object
        url = f'/crypto-exchanges/get_transactions/{self.crypto_exchange_account.id}/'
        request = self.factory.get(url)

        # authenticate the user
        force_authenticate(request, user=self.user)

        # call the get_transactions view function and get the response
        response = get_transactions(request, self.crypto_exchange_account.id)

        # assert that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # assert that the response data is the expected data
        expected_data = [{'crypto_exchange_object': self.crypto_exchange_account.id, 'asset': 'BTC',
                          'transaction_type': 'buy', 'amount': 1.0,
                          'timestamp': str(transaction.timestamp.isoformat()) + 'Z'
                          }]
        self.assertEqual(convert_to_dict_list(response.data), expected_data)


class TestGetTokenBreakdown(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='@user', first_name='Name', last_name='Lastname',
                                             email='namelastname@example.org')
        self.crypto_exchange_account = CryptoExchangeAccount.objects.create(
            user=self.user,
            crypto_exchange_name='Binance',
            api_key='wfeioguhwe549876y43jh',
            secret_key='wfjbh234987trfhu'
        )

    @patch('crypto_exchanges.views.CurrentMarketPriceFetcher.get_exchange_token_breakdown')
    def test_get_token_breakdown(self, mock_fetcher):
        mock_fetcher.return_value = {
            'token_data': [
                {'x': 'token1', 'y': 1},
                {'x': 'token2', 'y': 2},
            ]
        }

        url = f'crypto-exchanges/get_token_breakdown/{self.crypto_exchange_account.id}/'
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)

        response = get_token_breakdown(request, self.crypto_exchange_account.id)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'token_data': [{'x': 'token1', 'y': 1}, {'x': 'token2', 'y': 2}]})


class GetExchangeBalancesTestCase(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.crypto_exchange_account = CryptoExchangeAccount.objects.create(
            user=self.user,
            crypto_exchange_name='Binance',
            api_key='wfeioguhwe549876y43jh',
            secret_key='wfjbh234987trfhu'
        )

    def test_get_exchange_balances_success(self):
        url = 'crypto-exchanges/get_exchange_balances/'
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)

        with patch('crypto_exchanges.views.CurrentMarketPriceFetcher') as fetcher_mock:
            fetcher_instance_mock = fetcher_mock.return_value
            fetcher_instance_mock.chart_breakdown_crypto_exchanges.return_value = {
                'balances': [{'exchange': 'Test Exchange', 'btc_value': 1.0}]}
            response = get_exchange_balances(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'balances': [{'exchange': 'Test Exchange', 'btc_value': 1.0}]})

    def test_get_exchange_balances_failure_unauthenticated(self):
        CryptoExchangeAccount.objects.filter(user=self.user).delete()
        url = 'crypto-exchanges/get_exchange_balances/'
        request = self.factory.get(url)
        response = get_exchange_balances(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_exchange_balances_failure_no_exchanges(self):
        CryptoExchangeAccount.objects.filter(user=self.user).delete()

        url = 'crypto-exchanges/get_exchange_balances/'
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)

        response = get_exchange_balances(request)
        self.assertEqual(response.data, None)


class TestGenericCryptoExchanges(unittest.TestCase):
    def test_init(self):
        crypto_exchange = GenericCryptoExchanges()
        self.assertIsNone(crypto_exchange.crypto_exchange_name)
        self.assertIsNone(crypto_exchange.fetcher)

    def test_binance_view_init(self):
        binance_view = BinanceView()
        self.assertEqual(binance_view.crypto_exchange_name, 'Binance')
        self.assertEqual(binance_view.fetcher, BinanceFetcher)

    def test_gateio_view_init(self):
        gateio_view = GateioView()
        self.assertEqual(gateio_view.crypto_exchange_name, 'GateIo')
        self.assertEqual(gateio_view.fetcher, GateioFetcher)

    def test_init_coinlist(self):
        coin_list_view = CoinListView()
        self.assertEqual(coin_list_view.crypto_exchange_name, 'CoinList')
        self.assertEqual(coin_list_view.fetcher, CoinListFetcher)

    def test_init_coinbase(self):
        coinbase_view = CoinBaseView()
        self.assertEqual(coinbase_view.crypto_exchange_name, 'CoinBase')
        self.assertEqual(coinbase_view.fetcher, CoinBaseFetcher)

    def test_init_kraken(self):
        kraken_view = KrakenView()
        self.assertEqual(kraken_view.crypto_exchange_name, 'Kraken')
        self.assertEqual(kraken_view.fetcher, KrakenFetcher)

    def test_check_for_errors_from_the_response_to_the_api_call_with_error(self):
        data = {'msg': 'error message'}
        service = 'test_service'
        fetcher = BinanceFetcher
        view = GenericCryptoExchanges(fetcher=fetcher)
        response = view.check_for_errors_from_the_response_to_the_api_call(data, service)
        expected_response = Response({'error': 'error message'}, status=400)
        self.assertEqual(response.data, expected_response.data)
        self.assertEqual(response.status_code, expected_response.status_code)

    def test_check_for_errors_from_the_response_to_the_api_call_without_error(self):
        data = {'result': 'test_result'}
        service = 'test_service'
        fetcher = BinanceFetcher
        view = GenericCryptoExchanges(fetcher=fetcher)
        response = view.check_for_errors_from_the_response_to_the_api_call(data, service)
        self.assertIsNone(response)


class FilterNotEmptyBalanceTestCase(TestCase):

    def test_filter_not_empty_balance(self):
        crypto_exchange = GenericCryptoExchanges()
        with self.assertRaises(TypeError):
            crypto_exchange.filter_not_empty_balance()

    def test_filter_not_empty_balance_binance(self):
        binance_view = BinanceView()
        coin_to_check = {'free': 100}
        self.assertTrue(binance_view.filter_not_empty_balance(coin_to_check))
        coin_to_check = {'free': 0}
        self.assertFalse(binance_view.filter_not_empty_balance(coin_to_check))

    def test_filter_not_empty_balance_gateio(self):
        gateio_view = GateioView()
        coin_to_check = {'available': 100}
        self.assertTrue(gateio_view.filter_not_empty_balance(coin_to_check))
        coin_to_check = {'available': 0}
        self.assertFalse(gateio_view.filter_not_empty_balance(coin_to_check))

    def test_filter_not_empty_balance_coinlist(self):
        coinlist_view = CoinListView()
        coin_to_check = {0: 'BTC', 1: 100}
        self.assertTrue(coinlist_view.filter_not_empty_balance(coin_to_check))
        coin_to_check = {0: 'BTC', 1: 0}
        self.assertFalse(coinlist_view.filter_not_empty_balance(coin_to_check))

    def test_filter_not_empty_balance_coinbase(self):
        coinbase_view = CoinBaseView()
        coin_to_check = {'amount': 100}
        self.assertTrue(coinbase_view.filter_not_empty_balance(coin_to_check))
        coin_to_check = {'amount': 0}
        self.assertFalse(coinbase_view.filter_not_empty_balance(coin_to_check))

    def test_filter_not_empty_balance_kraken(self):
        kraken_view = KrakenView()
        coin_to_check = {0: 'BTC', 1: 100}
        self.assertTrue(kraken_view.filter_not_empty_balance(coin_to_check))
        coin_to_check = {0: 'BTC', 1: 0}
        self.assertFalse(kraken_view.filter_not_empty_balance(coin_to_check))


class GetDataUnifiedTestCase(TestCase):

    # def test_get_data_unified(self):
    #     generic = GenericCryptoExchanges()
    #     with self.assertRaises(NotImplementedError):
    #         generic.get_data_unified(None)

    def test_get_data_unified_binance(self):
        binance_view = BinanceView()
        data = {'balances': [{'asset': 'BTC', 'free': 1.0, 'locked': 0.0}]}
        expected = [{'asset': 'BTC', 'free': 1.0, 'locked': 0.0}]
        self.assertEqual(list(binance_view.get_data_unified(data)), expected)

    def test_get_data_unified_gateio(self):
        gateio_view = GateioView()
        data = {'BTC': {'available': 1.0, 'locked': 0.0}}
        self.assertEqual(gateio_view.get_data_unified(data), data)

    def test_get_data_unified_coinlist(self):
        coinlist_view = CoinListView()
        data = {'asset_balances': {'BTC': 1.0, 'ETH': 0.5}}
        expected = [('BTC', 1.0), ('ETH', 0.5)]
        self.assertEqual(list(coinlist_view.get_data_unified(data)), expected)

    def test_get_data_unified_coinbase(self):
        coinbase_view = CoinBaseView()
        data = {'amount': 1.0, 'currency': 'BTC'}
        self.assertEqual(coinbase_view.get_data_unified(data), data)

    def test_get_data_unified_kraken(self):
        kraken_view = KrakenView()
        data = {'result': {'XBT': '1.0', 'ETH': '0.5'}}
        expected = [('XBT', '1.0'), ('ETH', '0.5')]
        self.assertEqual(list(kraken_view.get_data_unified(data)), expected)


class SaveCoinsTestCase(TestCase):

    def test_binance_view_save_coins(self):
        binance = BinanceView()
        filtered_data = [{'asset': 'BTC', 'free': '1.0', 'locked': '0'}, {'asset': 'ETH', 'free': '0.5', 'locked': '0'}]
        request = MagicMock()
        new_user = User.objects.create_user(username='testuser', password='testpass')
        request.user = new_user
        saved_exchange_account_object = CryptoExchangeAccount.objects.create(user=new_user,
                                                                             crypto_exchange_name='Binance',
                                                                             api_key='apikey', secret_key='secretkey')
        binance.save_coins(filtered_data, request, saved_exchange_account_object)
        # assert that the tokens were saved with the expected values
        self.assertEqual(saved_exchange_account_object.token_set.count(), 2)
        self.assertEqual(saved_exchange_account_object.token_set.get(asset='BTC').free_amount, 1.0)
        self.assertEqual(saved_exchange_account_object.token_set.get(asset='ETH').free_amount, 0.5)

    def test_gateio_view_save_coins(self):
        gateio = GateioView()
        filtered_data = [{'currency': 'BTC', 'available': '1.0', 'locked': '0'},
                         {'currency': 'ETH', 'available': '0.5', 'locked': '0'}]
        request = MagicMock()
        new_user = User.objects.create_user(username='testuser', password='testpass')
        request.user = new_user
        saved_exchange_account_object = CryptoExchangeAccount.objects.create(user=new_user,
                                                                             crypto_exchange_name='Binance',
                                                                             api_key='apikey', secret_key='secretkey')
        gateio.save_coins(filtered_data, request, saved_exchange_account_object)
        # assert that the tokens were saved with the expected values
        self.assertEqual(saved_exchange_account_object.token_set.count(), 2)
        self.assertEqual(saved_exchange_account_object.token_set.get(asset='BTC').free_amount, 1.0)
        self.assertEqual(saved_exchange_account_object.token_set.get(asset='ETH').free_amount, 0.5)

    def test_coin_list_view_save_coins(self):
        coin_list = CoinListView()
        filtered_data = [('BTC', 1.0), ('ETH', 0.5)]
        request = MagicMock()
        new_user = User.objects.create_user(username='testuser', password='testpass')
        request.user = new_user
        saved_exchange_account_object = CryptoExchangeAccount.objects.create(user=new_user,
                                                                             crypto_exchange_name='Binance',
                                                                             api_key='apikey', secret_key='secretkey')
        coin_list.save_coins(filtered_data, request, saved_exchange_account_object)
        # assert that the tokens were saved with the expected values
        self.assertEqual(saved_exchange_account_object.token_set.count(), 2)
        self.assertEqual(saved_exchange_account_object.token_set.get(asset='BTC').free_amount, 1.0)
        self.assertEqual(saved_exchange_account_object.token_set.get(asset='ETH').free_amount, 0.5)

    def test_coin_base_view_save_coins(self):
        coin_base = CoinBaseView()
        filtered_data = [{'currency': 'BTC', 'amount': '1.0'}, {'currency': 'ETH', 'amount': '0.5'}]
        request = MagicMock()
        new_user = User.objects.create_user(username='testuser', password='testpass')
        request.user = new_user
        saved_exchange_account_object = CryptoExchangeAccount.objects.create(user=new_user,
                                                                             crypto_exchange_name='Binance',
                                                                             api_key='apikey', secret_key='secretkey')
        coin_base.save_coins(filtered_data, request, saved_exchange_account_object)
        # assert that the tokens were saved with the expected values
        self.assertEqual(saved_exchange_account_object.token_set.count(), 2)
        self.assertEqual(saved_exchange_account_object.token_set.get(asset='BTC').free_amount, 1.0)
        self.assertEqual(saved_exchange_account_object.token_set.get(asset='ETH').free_amount, 0.5)

    def test_kraken_view_save_coins(self):
        kraken = KrakenView()
        filtered_data = [('BTC', 1.0), ('ETH', 0.5)]
        request = MagicMock()
        new_user = User.objects.create_user(username='testuser', password='testpass')
        request.user = new_user
        saved_exchange_account_object = CryptoExchangeAccount.objects.create(user=new_user,
                                                                             crypto_exchange_name='Binance',
                                                                             api_key='apikey', secret_key='secretkey')
        kraken.save_coins(filtered_data, request, saved_exchange_account_object)
        # assert that the tokens were saved with the expected values
        self.assertEqual(saved_exchange_account_object.token_set.count(), 2)
        self.assertEqual(saved_exchange_account_object.token_set.get(asset='BTC').free_amount, 1.0)
        self.assertEqual(saved_exchange_account_object.token_set.get(asset='ETH').free_amount, 0.5)


class SaveTransactionsTestCase(TestCase):

    def test_binance_save_transactions(self):
        view = BinanceView()
        # prepare test data
        transactions = {'ETHUSDT': [{'symbol': 'ETHUSDT', 'time': 1646805893525, 'isBuyer': True, 'qty': 0.12345678}]}
        request = RequestFactory().get('/')
        new_user = User.objects.create_user(username='testuser', password='testpass')
        saved_exchange_account_object = CryptoExchangeAccount.objects.create(user=new_user,
                                                                             crypto_exchange_name='Binance',
                                                                             api_key='apikey', secret_key='secretkey')

        view.save_transactions(transactions, request, saved_exchange_account_object)
        saved_transaction = Transaction.objects.get(asset='ETHUSDT', amount=0.12345678)
        self.assertEqual(saved_transaction.asset, 'ETHUSDT')
        self.assertEqual(saved_transaction.amount, 0.12345678)
        self.assertEqual(saved_transaction.transaction_type, 'buy')
        self.assertEqual(saved_transaction.timestamp.astimezone(None),
                         millis_to_datetime(1646805893525).astimezone(None))

    def test_gateio_save_transactions(self):
        view = GateioView()
        # Mock data
        transactions = {
            "ETH_USDT": [
                {
                    "currency_pair": "ETH_USDT",
                    "side": "sell",
                    "amount": 2.5,
                    "create_time_ms": "1647650275161"
                }
            ]
        }
        request = RequestFactory().get('/')
        new_user = User.objects.create_user(username='testuser', password='testpass')
        saved_exchange_account_object = CryptoExchangeAccount.objects.create(user=new_user,
                                                                             crypto_exchange_name='Binance',
                                                                             api_key='apikey', secret_key='secretkey')

        view.save_transactions(transactions, request, saved_exchange_account_object)
        saved_transaction = Transaction.objects.get(asset='ETH_USDT', amount=2.5,
                                                    crypto_exchange_object=saved_exchange_account_object)
        self.assertEqual(saved_transaction.asset, 'ETH_USDT')
        self.assertEqual(saved_transaction.amount, 2.5)
        self.assertEqual(saved_transaction.transaction_type, 'sell')
        self.assertEqual(saved_transaction.timestamp.astimezone(None),
                         millis_to_datetime(1647650275161).astimezone(None))

    def test_coinlist_save_transactions(self):
        view = CoinListView()
        # prepare test data
        transactions = {'BTC': [
            {'symbol': 'BTC', 'transaction_type': 'SWAP', 'amount': '0.01',
             'created_at': '2022-03-09T06:04:53.525000Z'}]}
        request = RequestFactory().get('/')
        new_user = User.objects.create_user(username='testuser', password='testpass')
        saved_exchange_account_object = CryptoExchangeAccount.objects.create(user=new_user,
                                                                             crypto_exchange_name='CoinList',
                                                                             api_key='apikey', secret_key='secretkey')

        view.save_transactions(transactions, request, saved_exchange_account_object)

        # assert saved transaction data
        saved_transaction = Transaction.objects.get(asset='BTC', amount=0.01)
        self.assertEqual(saved_transaction.asset, 'BTC')
        self.assertEqual(saved_transaction.amount, 0.01)
        self.assertEqual(saved_transaction.transaction_type, 'buy')
        self.assertEqual(saved_transaction.timestamp,
                         datetime(2022, 3, 9, 6, 4, 53, 525000, tzinfo=timezone.utc))

    def test_coinbase_save_transactions(self):
        view = CoinBaseView()
        # prepare test data
        transactions = {'fills': [
            {'product_id': 'BTC-USD', 'trade_type': 'FILL', 'size': '0.01', 'trade_time': '2022-03-09T06:04:53.525Z'}
        ]}
        request = RequestFactory().get('/')
        new_user = User.objects.create_user(username='testuser', password='testpass')
        saved_exchange_account_object = CryptoExchangeAccount.objects.create(user=new_user,
                                                                             crypto_exchange_name='CoinBase',
                                                                             api_key='apikey', secret_key='secretkey')

        view.save_transactions(transactions, request, saved_exchange_account_object)

        # assert saved transaction data
        saved_transaction = Transaction.objects.get(asset='BTC-USD', amount=0.01)
        self.assertEqual(saved_transaction.asset, 'BTC-USD')
        self.assertEqual(saved_transaction.amount, 0.01)
        self.assertEqual(saved_transaction.transaction_type, 'buy')
        self.assertEqual(saved_transaction.timestamp,
                         datetime(2022, 3, 9, 6, 4, 53, 525000, tzinfo=timezone.utc))

    def test_kraken_save_transactions(self):
        view = KrakenView()
        # prepare test data
        transactions = {'result': {'trades': [{'pair': 'XBTUSD','type': 'buy','vol': '0.001','time': 1675884861}]}}
        request = RequestFactory().get('/')
        new_user = User.objects.create_user(username='testuser', password='testpass')
        saved_exchange_account_object = CryptoExchangeAccount.objects.create(user=new_user,
                                                                             crypto_exchange_name='Kraken',
                                                                             api_key='apikey', secret_key='secretkey')

        view.save_transactions(transactions, request, saved_exchange_account_object)

        # assert saved transaction data
        saved_transaction = Transaction.objects.get(asset='XBTUSD', amount=0.001)
        self.assertEqual(saved_transaction.asset, 'XBTUSD')
        self.assertEqual(saved_transaction.amount, 0.001)
        self.assertEqual(saved_transaction.transaction_type, 'buy')
        self.assertEqual(saved_transaction.timestamp,
                         datetime(2023, 2, 8, 19, 34, 21, 0, tzinfo=timezone.utc))


class GetMethodsOfViewsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
        self.url = reverse('crypto-exchanges')

    def test_get_crypto_exchange_accounts(self):
        # create a CryptoExchangeAccount object
        account = CryptoExchangeAccount.objects.create(
            user=self.user,
            api_key='my_api_key',
            secret_key='my_secret_key',
            crypto_exchange_name='binance',
        )

        # make a GET request to the view
        response = self.client.get(self.url)

        # assert that the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # assert that the response data is the expected data
        expected_data = [OrderedDict([('crypto_exchange_name', 'binance'), ('api_key', 'my_api_key'),
                                      ('secret_key', 'my_secret_key'),
                                      ('created_at', convert_date_string(str(account.created_at))), ('id', 1)])]
        self.assertEqual(response.data, expected_data)

    @patch.object(GenericCryptoExchanges, 'get')
    def test_binance_view_get(self, mock_get):
        mock_response_data = {'key': 'value'}
        mock_response = HttpResponse(json.dumps(mock_response_data), content_type='application/json', status=200)
        mock_get.return_value = mock_response

        request = HttpRequest()
        request.method = 'GET'
        request.headers = {'Accept': 'application/json'}

        force_authenticate(request, user=self.user)

        view = BinanceView.as_view()

        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content.decode('utf-8'), json.dumps(mock_response_data))

    @patch.object(GenericCryptoExchanges, 'get')
    def test_gateio_view_get(self, mock_get):
        mock_response_data = {'key': 'value'}
        mock_response = HttpResponse(json.dumps(mock_response_data), content_type='application/json', status=200)
        mock_get.return_value = mock_response

        request = HttpRequest()
        request.method = 'GET'
        request.headers = {'Accept': 'application/json'}

        force_authenticate(request, user=self.user)

        view = GateioView.as_view()

        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content.decode('utf-8'), json.dumps(mock_response_data))

    @patch.object(GenericCryptoExchanges, 'get')
    def test_coinlist_view_get(self, mock_get):
        mock_response_data = {'key': 'value'}
        mock_response = HttpResponse(json.dumps(mock_response_data), content_type='application/json', status=200)
        mock_get.return_value = mock_response

        request = HttpRequest()
        request.method = 'GET'
        request.headers = {'Accept': 'application/json'}

        force_authenticate(request, user=self.user)

        view = CoinListView.as_view()

        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content.decode('utf-8'), json.dumps(mock_response_data))

    @patch.object(GenericCryptoExchanges, 'get')
    def test_coinbase_view_get(self, mock_get):
        mock_response_data = {'key': 'value'}
        mock_response = HttpResponse(json.dumps(mock_response_data), content_type='application/json', status=200)
        mock_get.return_value = mock_response

        request = HttpRequest()
        request.method = 'GET'
        request.headers = {'Accept': 'application/json'}

        force_authenticate(request, user=self.user)

        view = CoinBaseView.as_view()

        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content.decode('utf-8'), json.dumps(mock_response_data))

    @patch.object(GenericCryptoExchanges, 'get')
    def test_kraken_view_get(self, mock_get):
        mock_response_data = {'key': 'value'}
        mock_response = HttpResponse(json.dumps(mock_response_data), content_type='application/json', status=200)
        mock_get.return_value = mock_response

        request = HttpRequest()
        request.method = 'GET'
        request.headers = {'Accept': 'application/json'}

        force_authenticate(request, user=self.user)

        view = KrakenView.as_view()

        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content.decode('utf-8'), json.dumps(mock_response_data))


class CryptoExchangeAccountCreationTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User.objects.create_user(username='test_user', password='password')

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        self.client.logout()

    # Testing for post is limited because real api/secret key pairs are needed for testing successful posting, which
    # is sensitive information
    @patch('crypto_exchanges.services.BinanceFetcher')
    def test_create_binance_account_invalid(self, mock_fetcher):
        mock_service = Mock()
        mock_service.get_account_data.return_value = {'balances': [{'asset': 'BTC', 'free': '1.234'}]}
        mock_service.get_trading_history.return_value = [
            {'symbol': 'BTCUSDT', 'time': 1647637311000, 'price': '58914.22000000', 'qty': '0.00200000',
             'commission': '0.00000200', 'commissionAsset': 'BNB'}]
        mock_fetcher.return_value = mock_service

        url = reverse('binance')
        data = {'api_key': 'abcdefghijklmnopqrstuvwxyz', 'secret_key': 'abcdefghijklmnopqrstuvwxyz'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'API-key format invalid.'})

    @patch('crypto_exchanges.services.GateioFetcher')
    def test_create_gateio_account_invalid(self, mock_fetcher):
        mock_service = Mock()
        mock_service.get_account_data.return_value = {'balances': [{'asset': 'BTC', 'free': '1.234'}]}
        mock_service.get_trading_history.return_value = [
            {'symbol': 'BTCUSDT', 'time': 1647637311000, 'price': '58914.22000000', 'qty': '0.00200000',
             'commission': '0.00000200', 'commissionAsset': 'BNB'}]
        mock_fetcher.return_value = mock_service

        url = reverse('gateio')
        data = {'api_key': 'abcdefghijklmnopqrstuvwxyz', 'secret_key': 'abcdefghijklmnopqrstuvwxyz'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'Invalid key provided'})

    @patch('crypto_exchanges.services.CoinListFetcher')
    def test_create_coin_list_account_invalid(self, mock_fetcher):
        # mock_service = Mock()
        # mock_service.get_account_data.return_value = {'asset_balances': {'BTC': 1.0, 'ETH': 0.5}}
        # mock_service.get_trading_history.return_value = {'BTC': [
        #     {'symbol': 'BTC', 'transaction_type': 'SWAP', 'amount': '0.01',
        #      'created_at': '2022-03-09T06:04:53.525000Z'}]}
        # mock_fetcher.return_value = mock_service

        url = reverse('coinlist')
        data = {'api_key': 'zNk5glD4B3owgefu347u9z3s+kHRZ5r/VM46isrhbiGkMFDkl7D/S', 'secret_key': '48/vZVp234ouitfwIG857AFW5d0vgIM48UgJKfETTl0RPEI3/DWHFi7byVDUSV65tdIQ-='}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'invalid api key'})

    @patch('crypto_exchanges.services.CoinBaseFetcher')
    def test_create_coinbase_account_invalid(self, mock_fetcher):
        mock_service = Mock()
        mock_service.get_account_data.return_value = {'balances': [{'asset': 'BTC', 'free': '1.234'}]}
        mock_service.get_trading_history.return_value = {'fills': [
            {'product_id': 'BTC-USD', 'trade_type': 'FILL', 'size': '0.01', 'trade_time': '2022-03-09T06:04:53.525Z'}
        ]}
        mock_fetcher.return_value = mock_service

        url = reverse('coinbase')
        data = {'api_key': 'abcdefghijklmnopqrstuvwxyz', 'secret_key': 'abcdefghijklmnopqrstuvwxyz'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'invalid api key'})

    @patch('crypto_exchanges.services.KrakenFetcher')
    def test_create_kraken_account_invalid(self, mock_fetcher):
        # mock_service = Mock()
        # mock_service.get_account_data.return_value = {'result': {'XBT': '1.0', 'ETH': '0.5'}}
        # mock_service.get_trading_history.return_value = {'result': {'trades': [{'pair': 'XBTUSD','type': 'buy','vol': '0.001','time': 1675884861}]}}
        # mock_fetcher.return_value = mock_service

        url = reverse('kraken')
        data = {'api_key': 'zNk5glD4B3owgefu347u9z3s+kHRZ5r/VM46isrhbiGkMFDkl7D/S', 'secret_key': '48/vZVp234ouitfwIG857AFW5d0vgIM48UgJKfETTl0RPEI3/DWHFi7byVDUSV65tdIQ-='}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'EAPI:Invalid key'})



# potential removal
# class UpdateAllTokensTestCase(APITestCase):
#     def setUp(self):
#         self.factory = APIRequestFactory()
#         self.user = User.objects.create_user(username='testuser', password='testpass')
#         self.crypto_exchange_account = CryptoExchangeAccount.objects.create(
#             user=self.user,
#             crypto_exchange_name='Binance',
#             api_key='wfeioguhwe549876y43jh',
#             secret_key='wfjbh234987trfhu'
#         )
#         self.object = UpdateAllTokens()
#
#     def test_update_all_tokens(self):
#         url = reverse('update')
#         request = self.factory.post(url)
#         force_authenticate(request, user=self.user)
#         response = self.object.post(request)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(Token.objects.count(), 0)  # check that all tokens have been deleted
#         self.assertEqual(CryptoExchangeAccount.objects.count(), 0)  # check that all exchange accounts have been deleted
#
#     def test_update_all_tokens_with_invalid_credentials(self):
#         url = reverse('update')
#         self.crypto_exchange_account.api_key = 'invalid_api_key'
#         self.crypto_exchange_account.secret_key = 'invalid_secret_key'
#         self.crypto_exchange_account.save()
#         response = self.client.post(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(Token.objects.count(), 0)  # check that no tokens have been created
#         self.assertEqual(CryptoExchangeAccount.objects.count(), 0)  # check that no exchange accounts have been deleted
#
#     def test_update_all_tokens_with_unknown_platform(self):
#         url = reverse('update')
#         self.crypto_exchange_account.crypto_exchange_name = 'UnknownPlatform'
#         self.crypto_exchange_account.save()
#         response = self.client.post(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(Token.objects.count(), 0)  # check that no tokens have been created
#         self.assertEqual(CryptoExchangeAccount.objects.count(), 1)  # check that exchange account has not been deleted
