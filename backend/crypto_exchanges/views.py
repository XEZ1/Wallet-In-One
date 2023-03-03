from abc import ABC, ABCMeta, abstractmethod

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_exchanges.serializers import CryptoExchangeAccountSerializer
from crypto_exchanges.services import *


# Create your views here.

# Generic class for crypto exchanges
class GenericCryptoExchanges(APIView):
    __metaclass__ = ABCMeta

    def __init__(self, crypto_exchange_name, fetcher, **kwargs):
        super().__init__(**kwargs)
        self.crypto_exchange_name = crypto_exchange_name
        self.fetcher = fetcher

    # Function to check for error in the API call
    @abstractmethod
    def check_for_errors_from_the_response_to_the_api_call(self, data, service):
        if self.fetcher == BinanceFetcher:
            if 'msg' in data:
                # encountering an error while retrieving data
                return Response({'error': data['msg']}, status=400)
        elif self.fetcher == HuobiFetcher:
            pass
        elif self.fetcher == GateioFetcher:
            if 'label' and 'message' in data:
                # encountering an error while retrieving data
                return Response({'error': data['message']}, status=400)
        elif self.fetcher == CoinListFetcher:
            if 'status' in data and (data['status'] != 'ok' or data['status'] != '200'):
                # encountering an error while retrieving data
                return Response({'error': data['message']}, status=400)
        elif self.fetcher == CoinBaseFetcher:
            if 'errors' in data:
                # encountering an error while retrieving data
                return Response({'error': data['errors'][0]['message']}, status=400)
        elif self.fetcher == KrakenFetcher:
            if 'error' in data and 'result' not in data:
                # encountering an error while retrieving data
                return Response({'error': data['error'][0]}, status=400)

    # Inner function for filtering data
    @abstractmethod
    def filter_not_empty_balance(self, coin_to_check):
        pass

    @abstractmethod
    def get_data_unified(self, data):
        pass

    @abstractmethod
    def save_coins(self, filtered_data, request, saved_exchange_account_object):
        pass

    def get(self, request):
        crypto_exchange_accounts = CryptoExchangeAccount.objects.filter(user=request.user)
        serializer = CryptoExchangeAccountSerializer(crypto_exchange_accounts, many=True)
        print(f'Us: {Response(serializer.data)}')
        return Response(serializer.data)

    @abstractmethod
    def post(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        # Create a field 'crypto_exchange' in the request dict to prevent double adding the same account
        request.data['crypto_exchange_name'] = self.crypto_exchange_name

        # Create an account
        account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=request.user,
                                                     crypto_exchange_name=request.data['crypto_exchange_name'],
                                                     api_key=request.data['api_key'],
                                                     secret_key=request.data['secret_key'])):
            return Response({'error': f'This account from {self.crypto_exchange_name} has already been added'},
                            status=400)

        # Use the provided API key and secret key to connect to the Binance API
        service = self.fetcher(request.data['api_key'], request.data['secret_key'])

        # Get the user's account information
        if self.fetcher == HuobiFetcher:
            # For some reason only every 4th/5th request is successful, thus it was decided to add this awful construct.
            # It is hard to explain why 4 requests fall while having the same input data, it seems like huobi API is
            # Encountering some internal server issues.
            success = False
            counter = 0
            while not success:
                try:
                    self.account_ids = service.get_account_IDs()
                    if self.account_ids['status'] == 'ok':
                        success = True
                    # Internal huobi_api error
                    elif self.account_ids['status'] == 'error' and self.account_ids[
                        'err-msg'] == 'Signature not valid: Verification failure [校验失败]':
                        raise TypeError
                    else:
                        return Response({'error': self.account_ids['err-msg']}, status=400)
                except TypeError:
                    counter += 1
                    if counter == 20:
                        return Response({'error': 'Huobi API is currently experiencing some issues. Please try later.'},
                                        status=503)

            success = False
            while not success:
                try:
                    data = service.get_account_data(self.account_ids)
                    success = True
                except TypeError:
                    pass
                except Exception:
                    pass
        else:
            data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the account
        checker: Response = self.check_for_errors_from_the_response_to_the_api_call(data, service)
        if checker:
            return checker

        # Save the binance account to the database
        saved_exchange_account_object = account.save()

        filtered_data = list(filter(self.filter_not_empty_balance, self.get_data_unified(data)))

        self.save_coins(filtered_data, request, saved_exchange_account_object)

        return Response(filtered_data, status=200)


    def get(self, request):
        crypto_exchange_accounts = CryptoExchangeAccount.objects.filter(user=request.user)
        serialiser = CryptoExchangeAccountSerializer(crypto_exchange_accounts, many=True)
        return Response(serialiser.data)
    def delete(self, request):
        crypto_exchange_account = CryptoExchangeAccount.objects.get(id=request.data['id'])
        if crypto_exchange_account.user != request.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = CryptoExchangeAccountSerializer(crypto_exchange_account)
        crypto_exchange_account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Binance
class BinanceView(GenericCryptoExchanges, ABC):
    def __init__(self):
        super().__init__('Binance', BinanceFetcher)

    # Inner function for filtering data
    def filter_not_empty_balance(self, coin_to_check):
        super(BinanceView, self).filter_not_empty_balance(coin_to_check)
        return float(coin_to_check['free']) > 0

    def get_data_unified(self, data):
        super(BinanceView, self).get_data_unified(data)
        return data['balances']

    def save_coins(self, filtered_data, request, saved_exchange_account_object):
        super(BinanceView, self).save_coins(filtered_data, request, saved_exchange_account_object)
        for coin in filtered_data:
            # Add token info
            token = Token()
            token.user = request.user
            token.asset = coin['asset']
            token.crypto_exchange_object = saved_exchange_account_object
            token.free_amount = float(coin['free'])
            token.locked_amount = float(coin['locked'])
            token.save()

    def post(self, request):
        return super(BinanceView, self).post(request)


# Huobi
class HuobiView(GenericCryptoExchanges, ABC):
    def __init__(self):
        super().__init__('Huobi', HuobiFetcher)

    # Inner function for filtering data
    def filter_not_empty_balance(self, coin_to_check):
        super(HuobiView, self).filter_not_empty_balance(coin_to_check)
        return float(coin_to_check['balance']) > 0

    def get_data_unified(self, data):
        super(HuobiView, self).get_data_unified(data)
        return data

    def save_coins(self, filtered_data, request, saved_exchange_account_object):
        super(HuobiView, self).save_coins(filtered_data, request, saved_exchange_account_object)
        for coin in filtered_data:
            # check if the coin already exists
            token = Token()
            token.user = request.user
            token.crypto_exchange_object = saved_exchange_account_object
            token.asset = coin['currency'].upper()
            token.free_amount = float(coin['balance'])
            token.locked_amount = float(coin['debt'])
            token.save()

    def post(self, request):
        return super(HuobiView, self).post(request)

# GateIo
class GateioView(GenericCryptoExchanges, ABC):
    def __init__(self):
        super().__init__('GateIo', GateioFetcher)

    # Inner function for filtering data
    def filter_not_empty_balance(self, coin_to_check):
        super(GateioView, self).filter_not_empty_balance(coin_to_check)
        return float(coin_to_check['available']) > 0

    def get_data_unified(self, data):
        super(GateioView, self).get_data_unified(data)
        return data

    def save_coins(self, filtered_data, request, saved_exchange_account_object):
        super(GateioView, self).save_coins(filtered_data, request, saved_exchange_account_object)
        for coin in filtered_data:
            # check if the coin already exists
            token = Token()
            token.user = request.user
            token.crypto_exchange_object = saved_exchange_account_object
            token.asset = coin['currency']
            token.free_amount = float(coin['available'])
            token.locked_amount = float(coin['locked'])
            token.save()

    def post(self, request):
        return super(GateioView, self).post(request)


# CoinList
class CoinListView(GenericCryptoExchanges, ABC):
    def __init__(self):
        super().__init__('CoinList', CoinListFetcher)

    # Inner function for filtering data
    def filter_not_empty_balance(self, coin_to_check):
        super(CoinListView, self).filter_not_empty_balance(coin_to_check)
        return float(coin_to_check[1]) > 0

    def get_data_unified(self, data):
        super(CoinListView, self).get_data_unified(data)
        return data['asset_balances'].items()

    def save_coins(self, filtered_data, request, saved_exchange_account_object):
        super(CoinListView, self).save_coins(filtered_data, request, saved_exchange_account_object)
        for coin in filtered_data:
            # check if the coin already exists
            token = Token()
            token.user = request.user
            token.crypto_exchange_object = saved_exchange_account_object
            token.asset = coin[0]
            token.free_amount = float(coin[1])
            token.locked_amount = float(0)
            token.save()

    def post(self, request):
        return super(CoinListView, self).post(request)


# CoinBase
class CoinBaseView(GenericCryptoExchanges, ABC):
    def __init__(self):
        super().__init__('CoinBase', CoinBaseFetcher)

    def filter_not_empty_balance(self, coin_to_check):
        super(CoinBaseView, self).filter_not_empty_balance(coin_to_check)
        return float(coin_to_check['amount']) > 0

    def get_data_unified(self, data):
        super(CoinBaseView, self).get_data_unified(data)
        return data

    def save_coins(self, filtered_data, request, saved_exchange_account_object):
        super(CoinBaseView, self).save_coins(filtered_data, request, saved_exchange_account_object)
        for coin in filtered_data:
            # check if the coin already exists
            token = Token()
            token.user = request.user
            token.crypto_exchange_object = saved_exchange_account_object
            token.asset = coin['currency']
            token.free_amount = float(coin['amount'])
            token.locked_amount = float(0)
            token.save()

    def post(self, request):
        return super(CoinBaseView, self).post(request)


# Kraken
class KrakenView(GenericCryptoExchanges, ABC):
    def __init__(self):
        super().__init__('Kraken', KrakenFetcher)

    def filter_not_empty_balance(self, coin_to_check):
        super(KrakenView, self).filter_not_empty_balance(coin_to_check)
        return float(coin_to_check[1]) > 0

    def get_data_unified(self, data):
        super(KrakenView, self).get_data_unified(data)
        return data['result'].items()

    def save_coins(self, filtered_data, request, saved_exchange_account_object):
        super(KrakenView, self).save_coins(filtered_data, request, saved_exchange_account_object)
        for coin in filtered_data:
            # check if the coin already exists
            token = Token()
            token.user = request.user
            token.crypto_exchange_object = saved_exchange_account_object
            token.asset = coin[0]
            token.free_amount = float(coin[1])
            token.locked_amount = float(0)
            token.save()

    def post(self, request):
        return super(KrakenView, self).post(request)


# Update the existing tokens retrieved from crypto exchanges
class UpdateAllTokens(APIView):
    def post(self, request):
        Token.objects.all().delete()
        counter = 1
        fixed_accounts = CryptoExchangeAccount.objects.all()
        for account in fixed_accounts:
            api_key = account.api_key
            secret_key = account.secret_key
            platform = account.crypto_exchange_name
            counter += 1
            account.delete()
            request.data['api_key'] = api_key
            request.data['secret_key'] = secret_key
            response = 0
            if platform == 'Binance':
                response = BinanceView()
            elif platform == 'Huobi':
                response = HuobiView()
            elif platform == 'GateIo':
                response = GateioView()
            elif platform == 'CoinList':
                response = CoinListView()
            elif platform == 'CoinBase':
                response = CoinBaseView()
            elif platform == 'Kraken':
                response = KrakenView()
            response.post(request)
        return Response({'message': 'Success. Data was updated successfully'}, status=200)
