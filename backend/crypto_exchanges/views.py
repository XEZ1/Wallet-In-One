from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from crypto_exchanges.serializers import BinanceAccountSerializer
from crypto_exchanges.services import BinanceFetcher


# Create your views here.

class BinanceCredentialsView(APIView):
    def post(self, request):
        pass
       