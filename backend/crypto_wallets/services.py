from datetime import datetime, date, timedelta
import statistics
import requests
from crypto_wallets.models import CryptoWallet, CryptoWalletTransaction

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
        data = response['data'][address]['address']

        self.type = data['type']
        self.balance = data['balance']
        self.received = data['received']
        self.spent = data['spent']
        self.output_count = data['output_count']
        self.unspent_output_count = data['unspent_output_count']
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
        for a in wallets:
            print(a.cryptocurrency)
        return [{'x': a.symbol + ' Wallet: ' + a.address[:15] + '...', 'y': round(getCryptoPrice(a.symbol)*a.balance,2), 'id': a.id} for a in wallets]

def calculate_predicted_balance(user):
    """
    First calculate spending over four weeks
    """
    today = datetime.today()
    last_month = today - timedelta(days=28)

    predicted_balance = {}
    value_change = {}
    crypto_wallets = list(CryptoWallet.objects.filter(user=user))
    for wallet in crypto_wallets:
        if wallet.symbol not in predicted_balance:
            predicted_balance[wallet.symbol] = 0
        predicted_balance[wallet.symbol] += wallet.balance

        transactions = list(CryptoWalletTransaction.objects.filter(crypto_wallet=wallet))
        for transaction in transactions:
            if transaction.time >= datetime.timestamp(last_month):
                if wallet.symbol not in value_change:
                    value_change[wallet.symbol] = 0
                value_change[wallet.symbol] += transaction.value

    for symbol in value_change:
        predicted_balance[symbol] += value_change[symbol]

    return predicted_balance


def calculate_received_spent(user):
    spent_received = {}
    crypto_wallets = list(CryptoWallet.objects.filter(user=user))
    for wallet in crypto_wallets:
        if wallet.symbol not in spent_received:
            spent_received[wallet.symbol] = {'spent': 0, 'received': 0}
        spent_received[wallet.symbol]['received'] += wallet.received
        spent_received[wallet.symbol]['spent'] += wallet.spent

    return spent_received


def calculate_average_spend(user):
    average_spend = {}
    crypto_wallets = list(CryptoWallet.objects.filter(user=user))

    for wallet in crypto_wallets:
        transactions = list(CryptoWalletTransaction.objects.filter(crypto_wallet=wallet))
        for transaction in transactions:
            if transaction.value < 0:
                if wallet.symbol not in average_spend:
                    average_spend[wallet.symbol] = []
                average_spend[wallet.symbol].append(transaction.value)

    for symbol in average_spend:
        average_spend[symbol] = statistics.fmean(average_spend[symbol])

    return average_spend
