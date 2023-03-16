import plaid
from plaid.api import plaid_api
from .models import StockAccount, Transaction
import math
from django.db.models import Max, Min, StdDev, Avg, Variance, Sum

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
        return [{'x': acc.name + '-' + acc.institution_name, 'y': acc.balance.amount, 'id': acc.account_id} for acc in accounts]
    

def calculate_metrics(transactions):
    metrics = {}

    metrics['total_number_of_transactions'] = len(transactions)
    metrics['highest_transaction'] = round(transactions.aggregate(Max('amount')).get('amount__max') or 0, 2)
    metrics['lowest_transaction'] = round(transactions.aggregate(Min('amount')).get('amount__min') or 0, 2)
    metrics['average_transaction'] = round(transactions.aggregate(Avg('amount')).get('amount__avg') or 0, 2)
    metrics['variance'] = round(transactions.aggregate(Variance('amount')).get('amount__variance') or 0, 2)
    metrics['standard_deviation'] = round(transactions.aggregate(StdDev('amount')).get('amount__stddev') or 0, 2)
    metrics['highest_fee'] = round(transactions.aggregate(Max('fees')).get('fees__max') or 0, 2)
    metrics['lowest_fee'] = round(transactions.aggregate(Min('fees')).get('fees__min') or 0, 2)
    metrics['average_fee'] = round(transactions.aggregate(Avg('fees')).get('fees__avg') or 0, 2)
    metrics['average_latitude'] = transactions.aggregate(Avg('latitude')).get('latitude__avg') or 0
    metrics['average_longitude'] = transactions.aggregate(Avg('longitude')).get('longitude__avg') or 0
    
    return metrics