import requests
import time
import hmac
import hashlib

class BinanceFetcher:

    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    def get_account_data(self):
        endpoint = "https://api.binance.com/api"
        timestamp = f"timestamp={self.current_time()}"
        request_url = f"{endpoint}/v3/account?{timestamp}&signature={self.hash(timestamp)}"
        print(request_url)
        headers = {'X-MBX-APIKEY': self.api_key}
        response = requests.get(url=request_url, headers=headers)
        return response.json()

    def hash(self, timestamp):
        return hmac.new(self.secret_key.encode('utf-8'), timestamp.encode('utf-8'), hashlib.sha256).hexdigest()

    def current_time(self):
        return round(time.time() * 1000)
