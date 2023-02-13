from django.contrib import admin

# Register your models here.

from django.contrib import admin

from crypto_wallets.models import CryptoWallet

admin.site.register(CryptoWallet)
