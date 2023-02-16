from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_exchanges.models import Token, BinanceAccount, HuobiAccount, GateioAccount, CoinListAccount
from crypto_exchanges.serializers import TokenSerializer, BinanceAccountSerializer, HuobiAccountSerializer, GateioAccountSerializer, CoinListAccountSerializer
from crypto_exchanges.services import BinanceFetcher, HuobiFetcher, GateioFetcher, CoinListFetcher


# Create your views here.

class BinanceView(APIView):
    def get(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        binance_account = BinanceAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        binance_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(BinanceAccount.objects.filter(user=self.request.user, api_key=self.request.data["api_key"], secret_key=self.request.data["secret_key"])):
            return Response({'error': 'This binance account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Binance API
        service = BinanceFetcher(self.request.data["api_key"], self.request.data["secret_key"])

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
                token.free = coin['free']
                token.locked = coin['locked']
                token.save()

        #print(token)
        #print(f"{filtered_data=}")
        return Response(filtered_data, status=200)



class HuobiView(APIView):
    def get(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        huobi_account = HuobiAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        huobi_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(HuobiAccount.objects.filter(user=self.request.user, api_key=self.request.data["api_key"], secret_key=self.request.data["secret_key"])):
            return Response({'error': 'This huobi account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Binance API
        service = HuobiFetcher(self.request.data["api_key"], self.request.data["secret_key"])

        # Get the user's account information
        # For some reason only every 4th/5th request is successful, thus it was decided to add this awful construct.
        # It is hard to explain why 4 requests fall while having the same input data, it seems like huobi API is
        # Encountering some internal server issues.
        success = False
        counter = 0
        while not success:
            try:
                self.data = service.get_account_data()
                success = True
            except TypeError:
                counter += 1
                if counter == 20:
                    return Response({'error': 'Huobi API is currently experiencing some issues. Please try later.'}, status=503)

        # Making sure the api and secret keys are valid before saving the binance account
        if 'status' in self.data and self.data['status'] == 'error':
            # encountering an error while retrieving data
            return Response({'error': self.data['err-msg']}, status=400)

        # Save the binance account to the database
        huobi_account.save()

        # Inner function for filtering data
        def filter_not_empty_balance(coin_to_check):
            return float(coin_to_check['balance']) > 0

        # Return the account information to the user
        filtered_data = list(filter(filter_not_empty_balance, self.data))

        # Create tokens
        for coin in filtered_data:
            # check if the coin already exists
            if bool(Token.objects.filter(user=self.request.user, asset=coin['currency'].upper)):
                token = Token.objects.get(user=self.request.user, asset=coin['currency'].upper)
                token.free += float(coin['balance'])
                token.save()

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin['currency'].upper()
                token.free = coin['balance']
                token.locked = coin['debt']
                token.save()

        return Response(filtered_data, status=200)



class GateioView(APIView):
    def get(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        gateio_account = GateioAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        gateio_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(GateioAccount.objects.filter(user=self.request.user, api_key=self.request.data["api_key"], secret_key=self.request.data["secret_key"])):
            return Response({'error': 'This binance account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Binance API
        service = GateioFetcher(self.request.data["api_key"], self.request.data["secret_key"])

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
                token.free = coin['available']
                token.locked = coin['locked']
                token.save()

        return Response(filtered_data, status=200)



class CoinListView(APIView):
    def get(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        coinlist_account = CoinListAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        coinlist_account.is_valid(raise_exception=True)

        # Checking if the account has already been registered
        if bool(CoinListAccount.objects.filter(user=self.request.user, api_key=self.request.data["api_key"], secret_key=self.request.data["secret_key"])):
            return Response({'error': 'This coinlist account has already been added'}, status=400)

        # Use the provided API key and secret key to connect to the Binance API
        service = CoinListFetcher(self.request.data["api_key"], self.request.data["secret_key"])

        # Get the user's account information
        data = service.get_account_data()

        # Making sure the api and secret keys are valid before saving the binance account
        if 'msg' in data:
            # encountering an error while retrieving data
            return Response({'error': data['msg']}, status=400)

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
                token = Token.objects.get(user=self.request.user, asset=coin['asset'])
                token.free += float(coin['free'])
                token.locked += float(coin['locked'])
                token.save()

            else:
                token = Token()
                token.user = self.request.user
                token.asset = coin['asset']
                token.free = coin['free']
                token.locked = coin['locked']
                token.save()

        return Response(filtered_data, status=200)
