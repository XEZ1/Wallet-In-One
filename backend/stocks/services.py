import plaid
from plaid.api import plaid_api
from .models import StockAccount

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