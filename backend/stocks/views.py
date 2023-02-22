from django.shortcuts import render
import plaid
import requests
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
import json
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import generics, permissions
from .serializers import AddStockAccount
from .models import StockAccount
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_balance_get_request import AccountsBalanceGetRequest
from flask import jsonify

PLAID_CLIENT_ID = '63ef90fc73e3070014496336'
PLAID_SECRET = 'a57f2537ac53e9842da752b987bb5b'
PLAID_ENV = 'sandbox'  # Change to 'development' or 'production' in production environment

@api_view(['POST'])
@csrf_exempt
def initiate_plaid_link(request):
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
    prods = ['auth', 'transactions']
    products = []
    for product in prods:
        products.append(Products(product))
    
    try:
        request = LinkTokenCreateRequest(
            products=products,
            client_name="KCL",
            language='en',
            country_codes=list(map(lambda x: CountryCode(x), ['US','CA'])),
            user=LinkTokenCreateRequestUser(
                client_user_id=str(request.user.id)
            )
        )
    # create link token
        response = client.link_token_create(request)
        link_token = response['link_token']
        return Response({'link_token': link_token})
    except plaid.ApiException as e:
        print(response)
        return json.loads(e.body)


@api_view(['POST'])
def get_access_token(request):
    public_token = request.data.get('public_token')
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
    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']
        return Response({'access_token': access_token, 'item_id': item_id})
    except plaid.ApiException as e:
        return json.loads(e.body)
    
@api_view(['POST'])
def get_balance(request):
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
    try:
        request = AccountsBalanceGetRequest(
            access_token=request.data.get('access_token')
        )
        response = client.accounts_balance_get(request)
        print(response.to_dict())
        return Response(response.to_dict())
    except plaid.ApiException as e:
        return json.loads(e.body)

class addAccount(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AddStockAccount
    queryset = StockAccount.objects.all()

@api_view(['GET'])
def listAccounts(request):
    accounts = StockAccount.objects.filter(user=request.user)
    serializer = AddStockAccount(accounts, many=True)
    return Response(serializer.data)
