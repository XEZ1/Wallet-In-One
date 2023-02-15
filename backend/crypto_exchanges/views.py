from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_exchanges.models import Token, BinanceAccount, HuobiAccount, CoinListAccount
from crypto_exchanges.serializers import TokenSerializer, BinanceAccountSerializer, HuobiAccountSerializer, CoinListAccountSerializer
from crypto_exchanges.services import BinanceFetcher, HuobiFetcher, CoinListFetcher


# Create your views here.

class BinanceView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        binance_account = BinanceAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        binance_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(BinanceAccount.objects.filter(user=self.request.user, api_key=self.request.data["api_key"], secret_key=self.request.data["secret_key"])):
            raise Exception('This binance account has already been added')

        # Use the provided API key and secret key to connect to the Binance API
        service = BinanceFetcher(self.request.data["api_key"], self.request.data["secret_key"])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the binance account
        if 'msg' in data:
            # encountering an error while retrieving data
            raise Exception(data['msg'])

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
                token = Token.objects.filter(user=self.request.user, asset=coin['asset'])
                token.free += coin['free']
                token.locked += coin['locked']

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin['asset']
                token.free = coin['free']
                token.locked = coin['locked']
                token.save()

        #print(token)
        #print(f"{filtered_data=}")
        return Response(filtered_data)



class HuobiView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        huobi_account = HuobiAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        huobi_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(HuobiAccount.objects.filter(user=self.request.user, api_key=self.request.data["api_key"], secret_key=self.request.data["secret_key"])):
            raise Exception('This huobi account has already been added')

        # Use the provided API key and secret key to connect to the Binance API
        service = HuobiFetcher(self.request.data["api_key"], self.request.data["secret_key"])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the binance account
        if 'msg' in data:
            # encountering an error while retrieving data
            raise Exception(data['msg'])

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
            if bool(Token.objects.filter(user=self.request.user, asset=coin['currency'])):
                token = Token.objects.filter(user=self.request.user, asset=coin['currency'])
                token.free += coin['balance']

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin['currency']
                token.free = coin['balance']
                token.locked = coin['debt']
                token.save()

        return Response(filtered_data)



class CoinListView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        coinlist_account = CoinListAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        coinlist_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CoinListAccount.objects.filter(user=self.request.user, api_key=self.request.data["api_key"], secret_key=self.request.data["secret_key"])):
            raise Exception('This coinlist account has already been added')

        # Use the provided API key and secret key to connect to the Binance API
        service = CoinListFetcher(self.request.data["api_key"], self.request.data["secret_key"])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the binance account
        if 'msg' in data:
            # encountering an error while retrieving data
            raise Exception(data['msg'])

        # Save the binance account to the database
        coinlist_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check['free']) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, data['balances']))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            if bool(Token.objects.filter(user=self.request.user, asset=coin['asset'])):
                token = Token.objects.filter(user=self.request.user, asset=coin['asset'])
                token.free += coin['free']
                token.locked += coin['locked']

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin['asset']
                token.free = coin['free']
                token.locked = coin['locked']
                token.save()

        return Response(filtered_data)
