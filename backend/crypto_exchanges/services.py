import requests
import time
import hmac
from hashlib import sha256, sha512
from base64 import b64encode, b64decode
from datetime import datetime, timezone
from urllib.parse import quote_plus, urlencode

from crypto_exchanges.models import Token, CryptoExchangeAccount


# Class was implemented according to: "https://binance-docs.github.io/apidocs/spot/en/#change-log"
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
        return hmac.new(self.secret_key.encode('utf-8'), timestamp.encode('utf-8'), sha256).hexdigest()

    def current_time(self):
        return round(time.time() * 1000)


# Class was implemented according to: "https://huobiapi.github.io/docs/spot/v1/en/#change-log"
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


# Class was implemented according to: "https://www.gate.io/docs/developers/apiv4/en/"
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
        message = sha512()
        message.update((payload_string or "").encode('utf-8'))
        hashed_payload = message.hexdigest()
        path = '%s\n%s\n%s\n%s\n%s' % (method, url, query_string or "", hashed_payload, timestamp)
        signature = hmac.new(self.secret_key.encode('utf-8'), path.encode('utf-8'), sha512).hexdigest()
        return {'KEY': self.api_key, 'Timestamp': str(timestamp), 'SIGN': signature}


# Class was implemented according to: "https://coinlist.co/help/api"
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
        secret = b64decode(self.secret_key)
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
            secret = b64decode(self.secret_key)
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
        h = hmac.new(key, data.encode('utf-8'), digestmod=sha256)
        return b64encode(h.digest()).decode('utf-8')

    def prehash(self, timestamp, method, path, body):
        return timestamp + method.upper() + path + (body or '')


# Class was implemented according to: "https://docs.cloud.coinbase.com/exchange/docs/requests"
# Create custom authentication for Coinbase API
class CoinBaseAuthorisation(requests.auth.AuthBase):
    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key.encode('utf-8')  # Convert string to bytes
        self.timestamp = str(int(time.time()))

    # A template for this callable hook was taken from the coinbase API documentation
    def __call__(self, request):
        # The hook should be callable
        message = self.timestamp + request.method + request.path_url + (request.body or '')
        signature = self.signature(message)  # Convert message to bytes

        # Add headers
        request.headers.update({
            'CB-ACCESS-SIGN': signature,
            'CB-ACCESS-TIMESTAMP': self.timestamp,
            'CB-ACCESS-KEY': self.api_key,
        })
        return request

    def signature(self, message):
        return hmac.new(self.secret_key, message.encode(), sha256).hexdigest()  # Convert string to bytes


class CoinBaseFetcher:
    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    def get_account_data(self):
        api_url = 'https://api.coinbase.com/v2/'
        auth = CoinBaseAuthorisation(self.api_key, self.secret_key)

        # Get current user
        response = requests.get(api_url + 'accounts', auth=auth)

        if response.status_code == 400 or response.status_code == 401 or response.status_code == 402 \
                or response.status_code == 403 or response.status_code == 404 or response.status_code == 405:
            return response.json()

        data_to_return = []

        data = response.json()['data']
        for coin in data:
            data_to_return.append(coin['balance'])

        return data_to_return


# Class was implemented according to: "https://docs.kraken.com/rest/"
class KrakenFetcher:
    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    # This method of getting the signature was taken from the API documentation and slightly modified
    def signature(self, urlpath, data, secret):
        post_data = urlencode(data)
        encoded = (str(data['nonce']) + post_data).encode()
        message = urlpath.encode() + sha256(encoded).digest()
        mac = hmac.new(b64decode(secret), message, sha512)
        sig_digest = b64encode(mac.digest())
        return sig_digest.decode()

    # Attaches auth headers and returns results of a POST request
    def get_account_data(self):
        # Construct the request and print the result
        url = 'https://api.kraken.com'
        path = '/0/private/Balance'
        timestamp = {"nonce": str(int(1000 * time.time()))}

        headers = {
            'API-Key': self.api_key,
            'API-Sign': self.signature(path, timestamp, self.secret_key),
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        response = requests.post((url + path), headers=headers, data=timestamp)

        return response.json()


# Test feature, code written by Krishna and modified by Ezzat, Michael
class CurrentMarketPriceFetcher:
    def __init__(self, user):
        self.user = user

    def get_crypto_price(self, symbol):
        url = f'https://min-api.cryptocompare.com/data/price?fsym={symbol}&tsyms=GBP'
        r = requests.get(url=url)
        response = r.json()
        try:
            price = float(response['GBP'])
        except KeyError:
            price = 0.0
        return price

    def total_user_balance_crypto(self):
        exchanges = CryptoExchangeAccount.objects.filter(user=self.user)
        total_balance = 0
        for exchange in exchanges:
            tokens = Token.objects.filter(crypto_exchange_object=exchange)
            total_balance += sum(
                self.get_crypto_price(token.asset) * (token.free_amount + token.locked_amount) for token in tokens)
        return round(total_balance, 2)

    def chart_breakdown_crypto_free(self):
        exchanges = CryptoExchangeAccount.objects.filter(user=self.user)
        if exchanges.exists():
            tokens = Token.objects.filter(crypto_exchange_object__in=exchanges)
            return [{'x': token.asset, 'y': round(self.get_crypto_price(token.asset) * token.free_amount, 2)}
                    for token in tokens]

    def chart_breakdown_crypto_locked(self):
        exchanges = CryptoExchangeAccount.objects.filter(user=self.user)
        if exchanges.exists():
            tokens = Token.objects.filter(crypto_exchange_object__in=exchanges)
            return [{'x': token.asset, 'y': round(self.get_crypto_price(token.asset) * token.locked_amount, 2)}
                    for token in tokens]

    def get_exchange_balance(self, exchange):
        tokens = Token.objects.filter(crypto_exchange_object=exchange)
        balance = 0
        for token in tokens:
            balance += self.get_crypto_price(token.asset) * (token.free_amount + token.locked_amount)
        return round(balance, 2)

    def chart_breakdown_crypto_exchanges(self):
        exchanges = CryptoExchangeAccount.objects.filter(user=self.user)
        if exchanges.exists():
            return [{'x': exchange.crypto_exchange_name,
                     'y': self.get_exchange_balance(exchange)}
                    for exchange in exchanges]
