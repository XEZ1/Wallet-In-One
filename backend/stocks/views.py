from django.http import JsonResponse
import plaid
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
import json
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import generics, permissions

from .serializers import AddStockAccount, AddTransaction, AddStock
from .models import StockAccount,Transaction, Stock

from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from flask import jsonify
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from .services import setUpClient, get_total_number_of_transactions, get_highest_transaction, get_lowest_transaction, get_average_transaction, get_variance_transaction, get_standard_deviation_transaction, get_range, get_highest_transaction_fee, get_lowest_transaction_fee, get_average_transaction_fee
from plaid.model.institutions_search_request import InstitutionsSearchRequest
from plaid.model.institutions_search_request_options import InstitutionsSearchRequestOptions
from plaid.model.investments_holdings_get_request import InvestmentsHoldingsGetRequest
from rest_framework import status
from plaid.model.investments_transactions_get_request import InvestmentsTransactionsGetRequest
from plaid.model.investments_transactions_get_request_options import InvestmentsTransactionsGetRequestOptions
from datetime import datetime
from datetime import timedelta
import datetime
import json
import time

@api_view(['POST'])
@csrf_exempt
def initiate_plaid_link(request):
    client = setUpClient()
    prods = ['investments', 'transactions']
    products = []
    for product in prods:
        products.append(Products(product))
    
    request = LinkTokenCreateRequest(
        products=products,
        client_name="KCL",
        language='en',
        country_codes=list(map(lambda x: CountryCode(x), ['US'])),
        user=LinkTokenCreateRequestUser(
            client_user_id=str(request.user.id)
        )
    )
    # create link token
    response = client.link_token_create(request)
    link_token = response['link_token']
    return Response({'link_token': link_token})



@api_view(['POST'])
def get_access_token(request):
    public_token = request.data.get('public_token')
    client = setUpClient()
    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        return Response({'access_token': access_token})
    except plaid.ApiException as e:
        return Response({"Error": json.loads(e.body)}, status=400)

    
@api_view(['POST'])
def get_balance(request):
    client = setUpClient()
    try:
        request = AccountsGetRequest(
            access_token=request.data.get('access_token')
        )
        response = client.accounts_get(request)
        return Response(response.to_dict())
    except plaid.ApiException as e:
        return Response({"Error": json.loads(e.body)}, status=400)
        

@api_view(['POST'])
def get_logo(request):
    client = setUpClient()
    options = InstitutionsSearchRequestOptions(include_optional_metadata=True)
    request = InstitutionsSearchRequest(
        query=request.data.get('name'),
        products=None,
        country_codes=list(map(lambda x: CountryCode(x), ['US'])),
        options=options
    )
    institution_response = client.institutions_search(request)
    if len(institution_response.institutions) != 0:
        return Response({'logo': institution_response.institutions[0].logo})
    else:
        return Response({"Error": 'Institution Does Not Exist'}, status=400)

@api_view(['POST'])
def get_stocks(request):
    client = setUpClient()
    try:
        request = InvestmentsHoldingsGetRequest(access_token=request.data.get('access_token'))
        response = client.investments_holdings_get(request)
        return Response(response.to_dict())
    except plaid.ApiException as e:
        return Response({"Error": json.loads(e.body)}, status=400)
    
@api_view(['POST'])
def get_transactions(request):
    client = setUpClient()
    start_date = (datetime.datetime.now() - timedelta(days=(1000)))
    end_date = datetime.datetime.now()
    try:
        options = InvestmentsTransactionsGetRequestOptions()
        request = InvestmentsTransactionsGetRequest(
            access_token=request.data.get('access_token'),
            start_date=start_date.date(),
            end_date=end_date.date(),
            options=options
        )
        response = client.investments_transactions_get(request)
        return Response(response.to_dict())
    except plaid.ApiException as e:
        return Response({"Error": json.loads(e.body)}, status=400)


class addAccount(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AddStockAccount
    queryset = StockAccount.objects.all()

class AddTransactions(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AddTransaction
    queryset = Transaction.objects.all()

@api_view(['GET'])
def listAccounts(request):
    accounts = StockAccount.objects.filter(user=request.user)
    serializer = AddStockAccount(accounts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def listTransactions(request,stock):
    transactions = Transaction.objects.filter(stock=stock)
    serializer = AddTransaction(transactions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def listStocks(request, stockAccount):
    stocks = Stock.objects.filter(stockAccount=stockAccount)
    serializer = AddStock(stocks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getTransaction(request, id):
    transaction = Transaction.objects.get(id=id)
    serializer = AddTransaction(transaction, many=False)
    return Response(serializer.data)

class addStock(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AddStock
    queryset = Stock.objects.all()


@api_view(['DELETE'])
def deleteAccount(request, stockAccount):
    stock_account = StockAccount.objects.get(account_id=stockAccount)
    if stock_account.user != request.user:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    stock_account.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
def getMetrics(request):
    stockAccounts = StockAccount.objects.filter(user=request.user)
    total_number_of_transactions = get_total_number_of_transactions(stockAccounts)
    highest_transaction = get_highest_transaction(stockAccounts)
    lowest_transaction = get_lowest_transaction(stockAccounts)
    average_transaction = get_average_transaction(stockAccounts)
    variance = get_variance_transaction(stockAccounts)
    standard_deviation = get_standard_deviation_transaction(stockAccounts)
    range = get_range(stockAccounts)
    highest_transaction_fee = get_highest_transaction_fee(stockAccounts)
    lowest_transaction_fee = get_lowest_transaction_fee(stockAccounts)
    average_transaction_fee = get_average_transaction_fee(stockAccounts)
    
    return Response({
        'total_number_of_transactions': total_number_of_transactions,
        'highest_transaction': highest_transaction,
        'lowest_transaction': lowest_transaction,
        'average_transaction': average_transaction,
        'variance': variance,
        'standard_deviation': standard_deviation,
        'range': range,
        'highest_transaction_fee': highest_transaction_fee,
        'lowest_transaction_fee': lowest_transaction_fee,
        'average_transaction_fee': average_transaction_fee
        })

@api_view(['GET'])
def getAccount(request, account_id):
    account = StockAccount.objects.get(account_id=account_id)
    return Response({'access_token': account.access_token, 'logo': account.institution_logo, 'balance': account.balance.amount})