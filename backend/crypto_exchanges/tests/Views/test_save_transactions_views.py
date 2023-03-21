from datetime import datetime, timezone
from django.contrib.auth.models import User
from django.test import TestCase, RequestFactory
from ...views import BinanceView, GateioView, CoinListView, CoinBaseView, KrakenView
from crypto_exchanges.serializers import *


def millis_to_datetime(millis):
    return datetime.fromtimestamp(millis / 1000.0)


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
