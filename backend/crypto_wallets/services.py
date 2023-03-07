from datetime import datetime

import requests
from crypto_wallets.models import CryptoWallet

API_KEY = "G___EAU7R8HuOi9HGRarUuX0xOujt6QQ"


# Handle unknown address
class CryptoWalletService:

    def __init__(self, cryptocurrency, address):
        url = f"https://api.blockchair.com/{cryptocurrency.lower()}/dashboards/address/{address}?key={API_KEY}" \
              f"&transaction_details=true&limit=1000"
        r = requests.get(url=url)
        if r.status_code != 200:
            self.type = None
            return

        response = r.json()
        self.balance = response['data'][address]['address']['balance']
        self.type = response['data'][address]['address']['type']
        self.transactions = response['data'][address]['transactions']


def get_timestamp(date_time):
    dt = datetime.strptime(date_time, "%Y-%m-%d %H:%M:%S")
    return datetime.timestamp(dt)


def normalise_value(cryptocurrency, value):
    return {
        'Bitcoin': value / 100_000_000,
        'Bitcoin-Cash': value / 100_000_000,
        'Litecoin': value / 100_000_000,
        'Dogecoin': value / 100_000_000,
        'Dash': value / 100_000_000,
        'Groestlcoin': value / 100_000_000,
        'Zcash': value / 100_000_000,
        'eCash': value / 100,
    }.get(cryptocurrency, value)

def getCryptoPrice(symbol):
    url = f'https://min-api.cryptocompare.com/data/price?fsym={symbol}&tsyms=GBP'
    r = requests.get(url=url)
    response = r.json()
    price = float(response['GBP'])
    return price

def total_user_balance_crypto(user):
    wallets = CryptoWallet.objects.filter(user=user)
    if wallets.exists():
        return round(sum(getCryptoPrice(a.symbol)*a.balance for a in wallets), 2) 
    else:
        return 0

def chart_breakdown_crypto(user):
    wallets = CryptoWallet.objects.filter(user=user)
    if wallets.exists():
        return [{'x': a.cryptocurrency, 'y': round(getCryptoPrice(a.symbol)*a.balance,2)} for a in wallets]