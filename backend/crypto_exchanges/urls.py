from django.urls import path
from crypto_exchanges import views

urlpatterns = [
    path('crypto-exchanges/binance', views.BinanceAPI.as_view(), name='add-crypto_excahnge_wallet')
]