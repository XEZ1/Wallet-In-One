from django.urls import path
from crypto_exchanges import views

urlpatterns = [
    path('', views.BinanceAPI.as_view(), name='add-crypto_excahnge_wallet')
]