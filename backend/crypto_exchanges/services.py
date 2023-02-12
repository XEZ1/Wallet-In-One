from crypto_exchanges.models import Token
import requests
import binance

class BinanceFetcher:
    @staticmethod
    def fetch_tokens(access_token):
        endpoint = "https://api.binance.com/api/v3/account"
        headers = {
            "X-MBX-APIKEY": access_token
        }

        response = requests.get(endpoint, headers=headers)
        if response.status_code != 200:
            raise Exception("Failed to retrieve data from Binance API.")

        data = response.json()
        balances = data["balances"]
        tokens = []
        for balance in balances:
            if float(balance["free"]) > 0:
                tokens.append(Token(
                    asset=balance["asset"],
                    free=balance["free"],
                    locked=balance["locked"]
                ))
        return tokens

class BinanceService:
    def __init__(self, api_key, secret_key):
        self.client = binance.Client(api_key, secret_key)

    def get_account(self):
        return self.client.get_account()