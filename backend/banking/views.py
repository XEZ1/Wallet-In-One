from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import get_institutions

@api_view()
def bank_list(request):
    return Response(get_institutions())
