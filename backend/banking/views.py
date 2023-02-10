from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .services import get_institutions, create_requisition, delete_all_requisitions

@api_view(['GET'])
def bank_list(request):
    return Response(get_institutions())

@api_view(['GET'])
def auth_page(request, id):
    delete_all_requisitions()
    response = create_requisition(id,"https://example.com",request.user.id)

    if ('link' in response.keys()):
        return Response({'url': response['link']})

    return Response({'url': None})


@api_view(['GET'])
@permission_classes([AllowAny])
def redirect_data(request):
    print(request)
    return Response({'data': True})