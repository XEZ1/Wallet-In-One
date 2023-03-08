import plaid
from plaid.api import plaid_api
from .models import StockAccount, Transaction
import math

PLAID_CLIENT_ID = '63ef90fc73e3070014496336'
PLAID_SECRET = 'a57f2537ac53e9842da752b987bb5b'
PLAID_ENV = 'sandbox'  # Change to 'development' or 'production' in production environment

def setUpClient():
    host = plaid.Environment.Sandbox
    configuration = plaid.Configuration(
    host=host,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
        'plaidVersion': '2020-09-14'
    }
    )

    api_client = plaid.ApiClient(configuration)
    client = plaid_api.PlaidApi(api_client)
    return client

def total_stock_balance(user):
    accounts = StockAccount.objects.filter(user=user)
    if accounts.exists():
        return sum(acc.balance for acc in accounts)
    else:
        return 0
    

def chart_breakdown_stocks(user):
    accounts = StockAccount.objects.filter(user=user)
    if accounts.exists():
        return [{'x': acc.name, 'y': acc.balance.amount} for acc in accounts]
    
def get_total_number_of_transactions(stockAccounts):
    num_of_transactions = 0
    for account in stockAccounts:
        num_of_transactions += Transaction.objects.filter(stock=account).count()

    return num_of_transactions

def get_highest_transaction(stockAccounts):
    highest_transaction = None
    for account in stockAccounts:
        transactions = Transaction.objects.filter(stock=account)
        for transaction in transactions:
            if highest_transaction == None or transaction.amount > highest_transaction:
                highest_transaction = transaction.amount

    return highest_transaction

def get_lowest_transaction(stockAccounts):
    lowest_transaction = None
    for account in stockAccounts:
        transactions = Transaction.objects.filter(stock=account)
        for transaction in transactions:
            if lowest_transaction == None or transaction.amount < lowest_transaction:
                lowest_transaction = transaction.amount

    return lowest_transaction

def get_average_transaction(stockAccounts):
    total = None
    for account in stockAccounts:
        transactions = Transaction.objects.filter(stock=account)
        for transaction in transactions:
            if total == None:
                total = transaction.amount
            else:
                total += transaction.amount

    if total == None:
        return total
    else:
        return total/get_total_number_of_transactions(stockAccounts)

def get_variance_transaction(stockAccounts):
    mean = get_average_transaction(stockAccounts)
    if mean == None:
        return None
    else:
        total = 0
        for account in stockAccounts:
            transactions = Transaction.objects.filter(stock=account)
            for transaction in transactions:
                total += pow((transaction.amount-mean), 2)

        return total/get_total_number_of_transactions(stockAccounts)
    
def get_standard_deviation_transaction(stockAccounts):
    variance = get_variance_transaction(stockAccounts)
    if variance == None:
        return None
    else:
        return math.sqrt(variance)