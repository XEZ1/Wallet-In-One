from django.urls import path
from crypto_exchanges import views

urlpatterns = [
    path('crypto-exchanges/update', views.UpdateAllTokens.as_view(), name='update'),
    path('crypto-exchanges', views.GenericCryptoExchanges.as_view(), name='crypto-exchanges'),
    path('crypto-exchanges/binance', views.BinanceView.as_view(), name='binance'),
    path('crypto-exchanges/gateio', views.GateioView.as_view(), name='gateio'),
    path('crypto-exchanges/coinlist', views.CoinListView.as_view(), name='coinlist'),
    path('crypto-exchanges/coinbase', views.CoinBaseView.as_view(), name='coinbase'),
    path('crypto-exchanges/kraken', views.KrakenView.as_view(), name='kraken'),
    path('crypto-exchanges/get_transactions/<int:exchange>/', views.get_transactions),
    path('crypto-exchanges/get_token_breakdown/<int:exchange>/', views.get_token_breakdown),
]
