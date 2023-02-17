from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone

from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import APIException
from .services import get_institutions, create_requisition, delete_all_requisitions, get_requisitions, get_account_data, total_user_balance, get_institution, update_user_accounts
from .serializers import URLSerializer, OldAccountSerializer, TransactionSerializer, AccountSerializer, format_money
from .models import Account, Transaction

@api_view(['GET'])
def bank_list(request):
    return Response(get_institutions())

@api_view(['GET'])
def auth_page(request, id):
    referance = str(request.user.id) + "-" + str(timezone.now().timestamp())
    response = create_requisition(id,"https://example.com", referance)

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
            return Transaction.objects.filter(account=id,account__user = self.request.user)
        else:
            return Transaction.objects.filter(account__user = self.request.user)

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
