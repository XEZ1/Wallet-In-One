from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .services import get_institutions, create_requisition, delete_all_requisitions, get_requisitions, get_account_data, get_account_details 
from .serializers import URLSerializer
from django.utils import timezone

@api_view(['GET'])
def bank_list(request):
    return Response(get_institutions())

@api_view(['GET'])
def auth_page(request, id):
    #delete_all_requisitions()

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
            
            if len(accounts) == 0:
                return Response({'error': 'No accounts were linked'}, status=400)
            else:
                accountsData = []
                for i in accounts:
                    account = {}
                    account['id'] = i
                    account['data'] = get_account_data(i)
                    account['details'] = get_account_details(i)
                    accountsData.append(account)
                print(accountsData)
                return Response(accountsData)     

        except StopIteration:
            return Response({'error': 'Link not found'}, status=400)
    else:
        return Response(serializer.errors, status=400)