from django.urls import path
from crypto_exchanges import views

urlpatterns = [
    path('crypto-exchanges/binance', views.BinanceView.as_view(), name='binance'),
    path('crypto-exchanges/huobi', views.HuobiView.as_view(), name='huobi'),
    path('crypto-exchanges/gateio', views.GateioView.as_view(), name='gateio'),
    path('crypto-exchanges/coinlist', views.CoinListView.as_view(), name='coinlist'),
    path('crypto-exchanges/kraken', views.KrakenView.as_view(), name='kraken'),
]