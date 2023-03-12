from django.urls import path

from crypto_wallets import views

urlpatterns = [
    path('', views.ListCryptoWallets.as_view(), name='crypto_wallets'),
    path('insights', views.CryptoWalletInsights.as_view(), name='crypto_wallet_insights')
]