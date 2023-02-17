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

from requests import Response


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

    def get_account_IDs(self):
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
        return response.json()

    def get_account_data(self, response):
        account_ids = [account['id'] for account in response['data']]
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

            return response.json()['data']['list']



class GateioFetcher:

    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    def get_account_data(self):
        endpoint = "https://api.gateio.ws/api/v4/spot/accounts"
        path = '/api/v4/spot/accounts'

        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        query_param = ''
        sign_headers = self.gen_sign('GET', path, query_param)
        headers.update(sign_headers)
        response = requests.request('GET', endpoint, headers=headers)

        return response.json()


    # This method of getting the right signature was specified in the API docs and modified by me.
    # https://www.gate.io/docs/developers/apiv4/en/#authentication
    def gen_sign(self, method, url, query_string=None, payload_string=None):
        timestamp = time.time()
        message = hashlib.sha512()
        message.update((payload_string or "").encode('utf-8'))
        hashed_payload = message.hexdigest()
        path = '%s\n%s\n%s\n%s\n%s' % (method, url, query_string or "", hashed_payload, timestamp)
        signature = hmac.new(self.secret_key.encode('utf-8'), path.encode('utf-8'), hashlib.sha512).hexdigest()
        return {'KEY': self.api_key, 'Timestamp': str(timestamp), 'SIGN': signature}


class CoinListFetcher:

    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    def get_account_data(self):
        endpoint = 'https://trade-api.coinlist.co'
        path = '/v1/accounts/'
        timestamp = str(int(time.time()))
        request_url = f"{endpoint}{path}"
        body = None
        method = 'GET'

        prehashed = self.prehash(timestamp, method, path, body)
        secret = base64.b64decode(self.secret_key)
        signature = self.sha265hmac(prehashed, secret)

        headers = {
            'Content-Type': 'application/json',
            'CL-ACCESS-KEY': self.api_key,
            'CL-ACCESS-SIG': signature,
            'CL-ACCESS-TIMESTAMP': timestamp
        }

        response_id = requests.get(url=request_url, headers=headers)

        if 'accounts' not in response_id.json():
            return response_id.json()

        # We retrieved ID addresses of sub-accounts, its time to retrieve the actual data
        to_return = {}
        for account_id in response_id.json()['accounts']:
            endpoint = 'https://trade-api.coinlist.co'
            path = f"""/v1/accounts/{account_id['trader_id']}"""
            timestamp = str(int(time.time()))
            request_url = f"{endpoint}{path}"
            body = None
            method = 'GET'

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
            to_return.update(response.json())

        return to_return

    def sha265hmac(self, data, key):
        h = hmac.new(key, data.encode('utf-8'), digestmod=hashlib.sha256)
        return base64.b64encode(h.digest()).decode('utf-8')

    def prehash(self, timestamp, method, path, body):
        return timestamp + method.upper() + path + (body or '')