from django.urls import path
from crypto_exchanges import views

urlpatterns = [
    path('crypto-exchanges/binance', views.BinanceView.as_view(), name='add-crypto_exchange_wallet')
]