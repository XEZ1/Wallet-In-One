from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Sum
from django.db.models.functions import TruncDate

from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import APIException
from rest_framework.views import APIView
from .services import get_institutions, create_requisition, delete_all_requisitions, get_requisitions, get_account_data, total_user_balance, get_institution, update_user_accounts
from .serializers import URLSerializer, OldAccountSerializer, TransactionSerializer, AccountSerializer, format_money
from .models import Account, Transaction
from djmoney.money import Money


@api_view(['GET'])
def bank_list(request):
    return Response(get_institutions())

@api_view(['GET'])
def auth_page(request, id):
    reference = str(request.user.id) + "-" + str(timezone.now().timestamp())
    response = create_requisition(id,"https://example.com", reference)

    if ('link' in response.keys()):
        return Response({'url': response['link']})

    return Response({'url': None})

@api_view(['POST'])
def finish_auth(request):
    serializer = URLSerializer(data=request.data)
    if serializer.is_valid():
        url = serializer.validated_data['url']
        r = get_requisitions()['results']
        try:
            requisition = next(filter(lambda x: x.get('link') == url, r))
            accounts = requisition['accounts']
            institution = get_institution(requisition['institution_id'])
            
            if len(accounts) == 0:
                return Response({'error': 'No accounts were linked'}, status=400)
            else:
                accountsData = []
                for i in accounts:
                    if (not Account.objects.filter(id=i).exists()):
                        new_account = Account(id=i, user=request.user, requisition_id= requisition['id'])
                        bank_id = requisition['institution_id']

                        data = get_account_data(i)
                        new_account.iban = data['iban']
                        new_account.institution_id = institution['id']
                        new_account.institution_name = institution['name']
                        new_account.institution_logo = institution['logo']
                        new_account.save()

                        accountsData.append({})
                
                if (len(accountsData) == 0):
                    return Response({'error': 'The bank account(s) you attempted to link have already be added to your account'}, status=400)
                else:
                    return Response(accountsData)    

        except StopIteration:
            return Response({'error': 'Link not found'}, status=400)
    else:
        return Response(serializer.errors, status=400)

class AccountList(generics.ListAPIView):
    model = Account
    serializer_class = AccountSerializer

    def get_queryset(self):
        update_user_accounts(self.request.user)
        id = self.kwargs.get('account_id')
        if (id):
            return Account.objects.filter(id=id, user = self.request.user)
        else:
            return Account.objects.filter(user = self.request.user)


class TransactionList(generics.ListAPIView):
    model = Transaction
    serializer_class = TransactionSerializer

    def get_queryset(self):
        update_user_accounts(self.request.user)
        id = self.kwargs.get('account_id')
        if (id):
            return Transaction.objects.filter(account=id,account__user = self.request.user).order_by('-time')
        else:
            return Transaction.objects.filter(account__user = self.request.user).order_by('-time')


from itertools import groupby

def group_transactions(transactions, interval, dict=True):

    transactions = transactions.annotate(date=TruncDate('time'))

    if interval == "day":
        key = lambda x: x.date
    elif interval == "time":
        key = lambda x: x.time
    elif interval == "month":
        key = lambda x: x.date.replace(day=1)
     
    groups = groupby(sorted(transactions,key=key,reverse=True), key=key)

    if dict:
        daily_transaction_sum = {str(date): sum(t.amount for t in group) for date, group in groups}
        return daily_transaction_sum
    else:
        return groups

def bar_data(transactions, interval):
    groups = group_transactions(transactions, interval, False)
    labels = []
    values = []
    for date, group in groups:
        if interval == 'day':
            labels.append(date.strftime("%d"))
        else:
            labels.append(date.strftime("%B"))
        values.append(sum(t.amount for t in group).amount)

    labels.reverse()
    values.reverse()

    data = group_transactions(transactions, interval)
    data = {date: amount.amount for date, amount in data.items()}
    return {'labels':labels,'values':values,'data':data}

def calculate_balance_history(transactions, balance, interval='day', format=True):

    # Group transactions by date
    daily_transaction_sum = group_transactions(transactions, interval)
    dates = sorted(daily_transaction_sum,reverse=True)

    daily_balances = {}
    for d in dates:
        if format:
            daily_balances[str(d)] = str(balance)
        else:
            daily_balances[str(d)] = balance.amount
        balance -= daily_transaction_sum[d]
    
    return daily_balances


class TransactionChartView(APIView):
    def get(self, request):
        balance = total_user_balance(request.user)
        transactions = Transaction.objects.filter(account__user = self.request.user)
        daily_balances = calculate_balance_history(transactions, balance, interval='day', format=True)
        return Response(daily_balances)

from dateutil.relativedelta import relativedelta
from django.db.models import Max, Min, StdDev, Avg, Variance, Sum

def calculate_metrics(transactions, bar_interval='month'):
    res= {}

    res['total_amount_of_transactions'] = len(transactions)
    res['highest_transaction'] = transactions.aggregate(Max('amount')).get('amount__max') or 0
    res['lowest_transaction'] = transactions.aggregate(Min('amount')).get('amount__min') or 0
    res['average_transaction'] = transactions.aggregate(Avg('amount')).get('amount__avg') or 0
    res['variance'] = transactions.aggregate(Variance('amount')).get('amount__variance') or 0
    res['standard_deviation'] = transactions.aggregate(StdDev('amount')).get('amount__stddev') or 0

    res['bar_data']= bar_data(transactions, interval=bar_interval)

    res['net'] = transactions.aggregate(Sum('amount')).get('amount__sum')
    return res
    
def calculate_metrics_all(transactions,balance,bar_interval='month'):
    res= {}
    positive = transactions.filter(amount__gt=0)
    negative = transactions.filter(amount__lt=0)

    res['positive'] = calculate_metrics(positive, bar_interval)
    res['negative'] = calculate_metrics(negative, bar_interval)
    res['both'] = calculate_metrics(transactions, bar_interval)

    balance_history= calculate_balance_history(transactions, balance, interval='day', format=False)
    
    res['balance_history'] = calculate_balance_history(transactions, balance, interval='day', format=False)
    res['highest_balance'] = max(balance_history.items(), key=lambda x: x[1], default=('',0))[1]
    res['lowest_balance'] = min(balance_history.items(), key=lambda x: x[1], default=('',0))[1]

    res['total_money_in'] = positive.aggregate(Sum('amount')).get('amount__sum') or 0
    res['total_money_out'] = negative.aggregate(Sum('amount')).get('amount__sum') or 0
    res['net'] = transactions.aggregate(Sum('amount')).get('amount__sum',0)
    return res

@api_view(['GET'])
def metrics(request, account_id=None):
    res = {}

    # Start of current month
    start1month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    start3month = start1month - relativedelta(months=3-1)
    start6month = start1month - relativedelta(months=6-1)
    start12month = start1month - relativedelta(months=12-1)


    res['1 month start'] = start1month
    # # Start of month 3 months ago
    res['3 month start '] = start3month
    # # Start of month 6 months ago
    res['6 month start'] = start6month
    # # Start of month 12 months ago
    res['12 month start'] = start12month

    #TODO: replace
    transactions = Transaction.objects.filter(account__user = request.user, amount_currency="GBP")
    #transactions = Transaction.objects.filter(account=Account.objects.all()[2], account__user = request.user, amount_currency="GBP")

    #balance = Account.objects.all()[2].account_balance() #TODO :remove
    balance = total_user_balance(request.user)

    res['all'] = calculate_metrics_all(transactions,balance)
    res['1month'] = calculate_metrics_all(transactions.filter(time__gte=start1month),balance,'day')
    res['3month'] = calculate_metrics_all(transactions.filter(time__gte=start3month),balance)
    res['6month'] = calculate_metrics_all(transactions.filter(time__gte=start6month),balance)
    return Response(res)    
    

@api_view(['GET'])
def delete_account(request, account_id):
    Account.objects.filter(user=request.user, id=account_id).delete()
    return Response({'Success': 'Deleted'}, status=200)
    
# Returns total balance of all user's bank accounts
@api_view(['GET'])
def get_total_balance(request):
    user = request.user
    amount = total_user_balance(user)
    return Response(format_money(amount))


@api_view(['GET'])
def delete_everything(request):
    delete_all_requisitions()
    Account.objects.all().delete()
    return Response({'Success': 'Everything has been deleted'}, status=200)

@api_view(['GET'])
def delete_account(request, account_id):
    Account.objects.filter(user=request.user, id=account_id).delete()
    return Response({'Success': 'Deleted'}, status=200)