from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_exchanges.models import Token
from crypto_exchanges.serializers import BinanceAccountSerializer, TokenSerializer
from crypto_exchanges.services import BinanceFetcher


# Create your views here.

class BinanceView(APIView):
    def post(self, request):
        # Pass the data to the serialiser so that the binance account can be created
        binance_account = BinanceAccountSerializer(data=request.data, context={'request': request})

        # Validate data
        binance_account.is_valid(raise_exception=True)

        # Save the binance account to the database
        binance_account.save()

        # Use the provided API key and secret key to connect to the Binance API
        service = BinanceFetcher(self.request.data["api_key"], self.request.data["secret_key"])

        # Get the user's account information
        data = service.get_account_data()

        print(type(binance_account))

        # Return the account information to the user
        filtered_data = list(filter(self.filter_not_empty_balance, data['balances']))
        for coin in filtered_data:
            token = Token()
            token.user = request.user
            token.asset = coin['asset']
            token.free = coin['free']
            token.locked = coin['locked']
            token.save()

        #print(token)
        #print(f"{filtered_data=}")
        return Response(filtered_data)

    def filter_not_empty_balance(self, coin):
        return float(coin['free']) > 0


