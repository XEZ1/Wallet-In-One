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


@admin.register(BinanceAccount)
class BinanceAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'api_key',
        'secret_key',
        'created_at'
    ]


@admin.register(HuobiAccount)
class BinanceAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'api_key',
        'secret_key',
        'created_at'
    ]


@admin.register(GateioAccount)
class BinanceAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'api_key',
        'secret_key',
        'created_at'
    ]


@admin.register(CoinListAccount)
class BinanceAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'api_key',
        'secret_key',
        'created_at'
    ]


@admin.register(KrakenAccount)
class BinanceAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'api_key',
        'secret_key',
        'created_at'
    ]


@admin.register(CoinbaseAccount)
class BinanceAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'api_key',
        'secret_key',
        'created_at'
    ]
