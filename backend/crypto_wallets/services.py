import requests
from crypto_wallets.models import CryptoWallet


def fetch_balance(address, cryptocurrency):
    # Handle unknown address
    # address = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    if cryptocurrency == 'Bitcoin':
        url = f'https://blockchain.info/rawaddr/{address}?limit=0'
        r = requests.get(url=url)
        response = r.json()
        return response['final_balance'] / 100_000_000
    elif cryptocurrency == 'Dogecoin':
        url = f'https://dogechain.info/api/v1/address/balance/{address}'
        r = requests.get(url=url)
        response = r.json()
        return response['balance']


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