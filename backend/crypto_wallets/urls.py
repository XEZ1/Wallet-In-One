from django.urls import path

from crypto_wallets import views

urlpatterns = [
    path('', views.ListCryptoWallets.as_view(), name='add_crypto_wallet')
]