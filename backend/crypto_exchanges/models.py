from django.db import models
from accounts.models import User
from django.core.validators import MinValueValidator


# Create your models here.

# Token model
class Token(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    asset = models.CharField(max_length=5, unique=True)
    free = models.FloatField()
    locked = models.FloatField()


# Crypto exchange account model
class CryptoExchangeAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    crypto_exchange = models.CharField(max_length=255)
    api_key = models.CharField(max_length=255)
    secret_key = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
