from urllib.request import Request

from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_exchanges.models import Token, CryptoExchangeAccount
from crypto_exchanges.serializers import TokenSerializer, CryptoExchangeAccountSerializer

from crypto_exchanges.services import *


# Create your views here.


# Binance
class BinanceView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        # Create a field 'crypto_exchange' in the request du=ict to prevent double adding the same account
        request.data['crypto_exchange_name'] = 'Binance'
        binance_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        binance_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=request.user,
                                                     crypto_exchange_name=request.data['crypto_exchange_name'],
                                                     api_key=request.data['api_key'],
                                                     secret_key=request.data['secret_key'])):
            return Response({'error': 'This binance account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Binance API
        service = BinanceFetcher(request.data['api_key'], request.data['secret_key'])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the binance account
        if 'msg' in data:
            # encountering an error while retrieving data
            return Response({'error': data['msg']}, status=400)

        # Save the binance account to the database
        saved_exchange_account_object = binance_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check['free']) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data['balances']))

        # Create tokens
        for coin in filtered_data:
            # Add token info
            token = Token()
            token.user = request.user
            token.asset = coin['asset']
            token.crypto_exchange_object = saved_exchange_account_object
            token.free_amount = float(coin['free'])
            token.locked_amount = float(coin['locked'])
            token.save()

        # print(token)
        # print(f"{filtered_data=}")
        return Response(filtered_data, status=200)


# Huobi
class HuobiView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the huobi account can be created
        # Create a field 'crypto_exchange' in the request dict to prevent double adding the same account
        request.data['crypto_exchange_name'] = 'Huobi'
        huobi_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        huobi_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=request.user,
                                                     crypto_exchange_name=request.data['crypto_exchange_name'],
                                                     api_key=request.data['api_key'],
                                                     secret_key=request.data['secret_key'])):
            return Response({'error': 'This huobi account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Huobi API
        service = HuobiFetcher(request.data['api_key'], request.data['secret_key'])

        # Making sure the api and secret keys are valid before saving the huobi account and
        # Get the user's account information
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

        # Now we have account IDs so we can retrieve the data from them
        # Get the user's account information
        # For some reason only every 4th/5th request is successful, thus it was decided to add this awful construct.
        # It is hard to explain why 4 requests fall while having the same input data, it seems like huobi API is
        # Encountering some internal server issues.
        success = False
        while not success:
            try:
                data = service.get_account_data(self.account_ids)
                success = True
            except TypeError:
                pass

        # Save the huobi account to the database
        saved_exchange_account_object = huobi_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check['balance']) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            token = Token()
            token.user = request.user
            token.crypto_exchange_object = saved_exchange_account_object
            token.asset = coin['currency'].upper()
            token.free_amount = float(coin['balance'])
            token.locked_amount = float(coin['debt'])
            token.save()

        return Response(filtered_data, status=200)


# GateIo
class GateioView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the gateio account can be created
        # Create a field 'crypto_exchange' in the request dict to prevent double adding the same account
        request.data['crypto_exchange_name'] = 'GateIo'
        gateio_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        gateio_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=request.user,
                                                     crypto_exchange_name=request.data['crypto_exchange_name'],
                                                     api_key=request.data['api_key'],
                                                     secret_key=request.data['secret_key'])):
            return Response({'error': 'This gateio account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Gateio API
        service = GateioFetcher(request.data['api_key'], request.data['secret_key'])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the gateio account
        if 'label' and 'message' in data:
            # encountering an error while retrieving data
            return Response({'error': data['message']}, status=400)

        # Save the gateio account to the database
        saved_exchange_account_object = gateio_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check['available']) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            token = Token()
            token.user = request.user
            token.crypto_exchange_object = saved_exchange_account_object
            token.asset = coin['currency']
            token.free_amount = float(coin['available'])
            token.locked_amount = float(coin['locked'])
            token.save()

        return Response(filtered_data, status=200)


# CoinList
class CoinListView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the coinlist account can be created
        # Create a field 'crypto_exchange' in the request du=ict to prevent double adding the same account
        request.data['crypto_exchange_name'] = 'CoinList'
        coinlist_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        coinlist_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=request.user,
                                                     crypto_exchange_name=request.data['crypto_exchange_name'],
                                                     api_key=request.data['api_key'],
                                                     secret_key=request.data['secret_key'])):
            return Response({'error': 'This coinlist account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Coinlist API
        service = CoinListFetcher(request.data['api_key'], request.data['secret_key'])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the coinlist account
        if 'status' in data and (data['status'] != 'ok' or data['status'] != '200'):
            # encountering an error while retrieving data
            return Response({'error': data['message']}, status=400)

        # Save the coinlist account to the database
        saved_exchange_account_object = coinlist_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check[1]) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data['asset_balances'].items()))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            token = Token()
            token.user = request.user
            token.crypto_exchange_object = saved_exchange_account_object
            token.asset = coin[0]
            token.free_amount = float(coin[1])
            token.locked_amount = float(0)
            token.save()

        return Response(filtered_data, status=200)


# CoinBase
class CoinBaseView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the coinbase account can be created
        # Create a field 'crypto_exchange' in the request dict to prevent double adding the same account
        request.data['crypto_exchange_name'] = 'CoinBase'
        coinbase_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        coinbase_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=request.user,
                                                     crypto_exchange_name=request.data['crypto_exchange_name'],
                                                     api_key=request.data['api_key'],
                                                     secret_key=request.data['secret_key'])):
            return Response({'error': 'This coinbase account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Coinbase API
        service = CoinBaseFetcher(request.data['api_key'], request.data['secret_key'])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the coinbase account
        if 'errors' in data:
            # encountering an error while retrieving data
            return Response({'error': data['errors'][0]['message']}, status=400)

        # Save the coinbase account to the database
        saved_exchange_account_object = coinbase_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check['amount']) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            token = Token()
            token.user = request.user
            token.crypto_exchange_object = saved_exchange_account_object
            token.asset = coin['currency']
            token.free_amount = float(coin['amount'])
            token.locked_amount = float(0)
            token.save()

        return Response(filtered_data, status=200)


# Kraken
class KrakenView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the kraken account can be created
        # Create a field 'crypto_exchange' in the request dict to prevent double adding the same account
        request.data['crypto_exchange_name'] = 'Kraken'
        kraken_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        kraken_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=request.user,
                                                     crypto_exchange_name=request.data['crypto_exchange_name'],
                                                     api_key=request.data['api_key'],
                                                     secret_key=request.data['secret_key'])):
            return Response({'error': 'This kraken account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Kraken API
        service = KrakenFetcher(request.data['api_key'], request.data['secret_key'])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the kraken account
        if 'error' in data and 'result' not in data:
            # encountering an error while retrieving data
            return Response({'error': data['error'][0]}, status=400)

        # Save the kraken account to the database
        saved_exchange_account_object = kraken_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check[1]) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data['result'].items()))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            token = Token()
            token.user = request.user
            token.crypto_exchange_object = saved_exchange_account_object
            token.asset = coin[0]
            token.free_amount = float(coin[1])
            token.locked_amount = float(0)
            token.save()

        return Response(filtered_data, status=200)


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
