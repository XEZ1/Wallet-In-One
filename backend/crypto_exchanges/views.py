from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_exchanges.models import Token, CryptoExchangeAccount
from crypto_exchanges.serializers import TokenSerializer, CryptoExchangeAccountSerializer

from crypto_exchanges.services import BinanceFetcher, HuobiFetcher, GateioFetcher, CoinListFetcher, KrakenFetcher, \
    CoinbaseFetcher


# Create your views here.


# Binance
class BinanceView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        # Create a field 'crypto_exchange' in the request du=ict to prevent double adding the same account
        request.data['crypto_exchange'] = 'Binance'
        binance_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        binance_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=self.request.user, crypto_exchange=self.request.data['crypto_exchange'], api_key=self.request.data['api_key'], secret_key=self.request.data['secret_key'])):
            return Response({'error': 'This binance account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Binance API
        service = BinanceFetcher(self.request.data['api_key'], self.request.data['secret_key'])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the binance account
        if 'msg' in data:
            # encountering an error while retrieving data
            return Response({'error': data['msg']}, status=400)

        # Save the binance account to the database
        binance_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check['free']) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data['balances']))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            if bool(Token.objects.filter(user=self.request.user, asset=coin['asset'])):
                token = Token.objects.get(user=self.request.user, asset=coin['asset'])
                token.free += float(coin['free'])
                token.locked += float(coin['locked'])
                token.save()

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin['asset']
                token.free = float(coin['free'])
                token.locked = float(coin['locked'])
                token.save()

        #print(token)
        #print(f"{filtered_data=}")
        return Response(filtered_data, status=200)


# Huobi
class HuobiView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        # Create a field 'crypto_exchange' in the request du=ict to prevent double adding the same account
        request.data['crypto_exchange'] = 'Huobi'
        huobi_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        huobi_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=self.request.user, crypto_exchange=self.request.data['crypto_exchange'], api_key=self.request.data['api_key'], secret_key=self.request.data['secret_key'])):
            return Response({'error': 'This huobi account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Binance API
        service = HuobiFetcher(self.request.data['api_key'], self.request.data['secret_key'])

        # Making sure the api and secret keys are valid before saving the binance account and
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
                elif self.account_ids['status'] == 'error' and self.account_ids['err-msg'] == 'Signature not valid: Verification failure [校验失败]':
                    raise TypeError
                else:
                    return Response({'error': self.account_ids['err-msg']}, status=400)
            except TypeError:
                counter += 1
                if counter == 20:
                    return Response({'error': 'Huobi API is currently experiencing some issues. Please try later.'}, status=503)

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

        # Save the binance account to the database
        huobi_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check['balance']) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            if bool(Token.objects.filter(user=self.request.user, asset=coin['currency'].upper())):
                token = Token.objects.get(user=self.request.user, asset=coin['currency'].upper())
                token.free += float(coin['balance'])
                token.save()

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin['currency'].upper()
                token.free = float(coin['balance'])
                token.locked = float(coin['debt'])
                token.save()

        return Response(filtered_data, status=200)


# GateIo
class GateioView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        # Create a field 'crypto_exchange' in the request du=ict to prevent double adding the same account
        request.data['crypto_exchange'] = 'GateIo'
        gateio_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        gateio_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=self.request.user, crypto_exchange=self.request.data['crypto_exchange'], api_key=self.request.data['api_key'], secret_key=self.request.data['secret_key'])):
            return Response({'error': 'This gateio account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Binance API
        service = GateioFetcher(self.request.data['api_key'], self.request.data['secret_key'])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the binance account
        if 'label' and 'message' in data:
            # encountering an error while retrieving data
            return Response({'error': data['message']}, status=400)

        # Save the binance account to the database
        gateio_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check['available']) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            if bool(Token.objects.filter(user=self.request.user, asset=coin['currency'])):
                token = Token.objects.get(user=self.request.user, asset=coin['currency'])
                token.free += float(coin['available'])
                token.locked += float(coin['locked'])
                token.save()

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin['currency']
                token.free = float(coin['available'])
                token.locked = float(coin['locked'])
                token.save()

        return Response(filtered_data, status=200)


# CoinList
class CoinListView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        # Create a field 'crypto_exchange' in the request du=ict to prevent double adding the same account
        request.data['crypto_exchange'] = 'CoinList'
        coinlist_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        coinlist_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=self.request.user, crypto_exchange=self.request.data['crypto_exchange'], api_key=self.request.data['api_key'], secret_key=self.request.data['secret_key'])):
            return Response({'error': 'This coinlist account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Binance API
        service = CoinListFetcher(self.request.data['api_key'], self.request.data['secret_key'])

        # Get the user's account information
        data = service.get_account_data()

        print(data)

        # Making sure the api and secret keys are valid before saving the binance account
        if 'status' in data and (data['status'] != 'ok' or data['status'] != '200'):
            # encountering an error while retrieving data
            return Response({'error': data['message']}, status=400)

        # Save the binance account to the database
        coinlist_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check[1]) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data['asset_balances'].items()))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            if bool(Token.objects.filter(user=self.request.user, asset=coin[0])):
                token = Token.objects.get(user=self.request.user, asset=coin[0])
                token.free += float(coin[1])
                token.locked += float(0)
                token.save()

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin[0]
                token.free = float(coin[1])
                token.locked = float(0)
                token.save()

        return Response(filtered_data, status=200)


# Kraken
class KrakenView(APIView):
    def post(self, request):
        # Create a field 'crypto_exchange' in the request du=ict to prevent double adding the same account
        request.data['crypto_exchange'] = 'Kraken'
        kraken_account = CryptoExchangeAccountSerializer(data=self.request.data, context={'request': request})

        kraken_account.is_valid(raise_exception=True)

        if bool(CryptoExchangeAccount.objects.filter(user=self.request.user, crypto_exchange=self.request.data['crypto_exchange'], api_key=self.request.data['api_key'],
                                             secret_key=self.request.data['secret_key'])):
            return Response({'error': 'This kraken account has already been added'}, status=400)

        service = KrakenFetcher(self.request.data['api_key'], self.request.data['secret_key'])

        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the kraken account
        if 'EAPI' in data:
            # encountering an error while retrieving data
            return Response({'error': data['EAPI']}, status=400)

        kraken_account.save()

        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check[1]) > 0

        filtered_data = list(filter(filter_not_empty_balance, data['result'].items()))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            if bool(Token.objects.filter(user=self.request.user, asset=coin[0])):
                token = Token.objects.get(user=self.request.user, asset=coin[0])
                token.free += float(coin[1])
                token.locked += float(0)
                token.save()

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin[0]
                token.free = float(coin[1])
                token.locked = float(0)
                token.save()

        return Response(filtered_data, status=200)


# Coinbase
class CoinbaseView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the coinbase account can be created
        # Create a field 'crypto_exchange' in the request du=ict to prevent double adding the same account
        request.data['crypto_exchange'] = 'CoinBase'
        coinbase_account = CryptoExchangeAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        coinbase_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CryptoExchangeAccount.objects.filter(user=self.request.user, crypto_exchange=self.request.data['crypto_exchange'], api_key=self.request.data['api_key'],
                                               secret_key=self.request.data['secret_key'])):
            return Response({'error': 'This coinbase account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the coinbase API
        service = CoinbaseFetcher(self.request.data['api_key'], self.request.data['secret_key'])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the coinbase account
        if 'msg' in data:
            # encountering an error while retrieving data
            return Response({'error': data['msg']}, status=400)

        # Save the coinbase account to the database
        coinbase_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check['free']) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data['balances']))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            if bool(Token.objects.filter(user=self.request.user, asset=coin['asset'])):
                token = Token.objects.get(user=self.request.user, asset=coin['asset'])
                token.free += float(coin['free'])
                token.locked += float(coin['locked'])
                token.save()

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin['asset']
                token.free = float(coin['free'])
                token.locked = float(coin['locked'])
                token.save()

        return Response(filtered_data, status=200)
