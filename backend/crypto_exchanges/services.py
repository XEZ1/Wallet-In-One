import requests
import time
import hmac
import hashlib
import json
import base64

class BinanceFetcher:

    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    def get_account_data(self):
        endpoint = "https://api.binance.com/api"
        timestamp = f"timestamp={self.current_time()}"
        request_url = f"{endpoint}/v3/account?{timestamp}&signature={self.hash(timestamp)}"
        headers = {'X-MBX-APIKEY': self.api_key}
        response = requests.get(url=request_url, headers=headers)
        return response.json()

    def hash(self, timestamp):
        return hmac.new(self.secret_key.encode('utf-8'), timestamp.encode('utf-8'), hashlib.sha256).hexdigest()

    def current_time(self):
        return round(time.time() * 1000)



class CoinListFetcher:

    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    def get_account_data(self):
        endpoint = 'https://trade-api.coinlist.co'
        path = f'v1/accounts/{self.api_key}'
        timestamp = str(int(time.time()))
        request_url = f"{endpoint}/v1/accounts/{self.api_key}"
        body = None
        method = 'POST'

        prehashed = self.prehash(timestamp, method, path, body)
        secret = base64.b64decode(self.secret_key)
        signature = self.sha265hmac(prehashed, secret)

        headers = {
            'Content-Type': 'application/json',
            'CL-ACCESS-KEY': self.api_key,
            'CL-ACCESS-SIG': signature,
            'CL-ACCESS-TIMESTAMP': timestamp
        }

        response = requests.get(url=request_url, headers=headers)
        return response.json()

    def sha265hmac(self, data, key):
        h = hmac.new(key, data.encode('utf-8'), digestmod=hashlib.sha256)
        return base64.b64encode(h.digest()).decode('utf-8')

    def prehash(self, timestamp, method, path, body):
        return timestamp + method.upper() + path + (body or '')