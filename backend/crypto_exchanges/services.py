from crypto_exchanges.models import Token
import requests

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