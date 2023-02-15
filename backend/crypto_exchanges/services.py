import requests
import time
import hmac
import hashlib
import base64
from hashlib import sha256
from base64 import b64encode
from urllib.parse import urlencode
from datetime import datetime, timezone
from urllib.parse import quote_plus

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



class HuobiFetcher:

    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    def get_account_data(self):
        # Get account IDs
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')
        params = {
            'AccessKeyId': self.api_key,
            'SignatureMethod': 'HmacSHA256',
            'SignatureVersion': '2',
            'Timestamp': timestamp,
        }

        method = 'GET'
        endpoint = '/v1/account/accounts'
        base_uri = 'api.huobi.pro'

        sorted_params = sorted(params.items(), key=lambda x: x[0])
        encoded_params = urlencode(sorted_params, quote_via=quote_plus)

        pre_signed_text = '\n'.join([method, base_uri, endpoint, encoded_params])
        hash_code = hmac.new(self.secret_key.encode(), pre_signed_text.encode(), sha256).digest()
        signature = b64encode(hash_code).decode()

        url = f"https://{base_uri}{endpoint}?{encoded_params}&Signature={signature}"
        response = requests.get(url)
        account_ids = [account['id'] for account in response.json()['data']]

        # Get account balances
        balances = {}
        for account_id in account_ids:
            timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')
            params = {
                'AccessKeyId': self.api_key,
                'SignatureMethod': 'HmacSHA256',
                'SignatureVersion': '2',
                'Timestamp': timestamp,
                'account-id': account_id
            }

            method = 'GET'
            endpoint = f'/v1/account/accounts/{account_id}/balance'
            base_uri = 'api.huobi.pro'

            sorted_params = sorted(params.items(), key=lambda x: x[0])
            encoded_params = urlencode(sorted_params, quote_via=quote_plus)

            pre_signed_text = '\n'.join([method, base_uri, endpoint, encoded_params])
            hash_code = hmac.new(self.secret_key.encode(), pre_signed_text.encode(), sha256).digest()
            signature = b64encode(hash_code).decode()

            url = f"https://{base_uri}{endpoint}?{encoded_params}&Signature={signature}"
            response = requests.get(url)
            data = response.json()['data']['list']

            return data



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