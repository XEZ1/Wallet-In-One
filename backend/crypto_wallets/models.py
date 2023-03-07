from django.db import models

from accounts.models import User


# Create your models here.

class CryptoWallet(models.Model):
    """
    This is a temporary model, which will be replaced with either the Account / Asset model that will be created in
    another user story.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cryptocurrency = models.CharField(max_length=256)
    symbol = models.CharField(max_length=16)
    address = models.CharField(max_length=256, blank=False, unique=True)
    balance = models.FloatField()


class CryptoWalletTransaction(models.Model):
    crypto_wallet = models.ForeignKey(CryptoWallet, on_delete=models.CASCADE)
    value = models.FloatField()
    time = models.IntegerField()
