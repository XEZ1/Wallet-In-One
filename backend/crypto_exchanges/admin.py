from django.contrib import admin
from .models import *


# Register your models here.

@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'asset',
        'free',
        'locked'
    ]


@admin.register(CryptoExchangeAccount)
class BinanceAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'crypto_exchange',
        'api_key',
        'secret_key',
        'created_at'
    ]

