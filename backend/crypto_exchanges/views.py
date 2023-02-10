from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_exchanges.models import Token
from crypto_exchanges.serializers import TokenSerializer
from crypto_exchanges.services import BinanceFetcher


# Create your views here.

class BinanceAPI(views.APIView):
    def get(self, request, format=None):
        token = request.query_params.get("token")
        if not token:
            return Response({"error": "Token is required."})

        try:
            tokens = BinanceFetcher.fetch_tokens(token)
            serializer = TokenSerializer(tokens, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)})