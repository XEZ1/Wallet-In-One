from django.db import models
from accounts.models import User
from djmoney.models.fields import MoneyField


class StockAccount(models.Model):
    account_id = models.CharField(max_length=1024, primary_key=True, unique=True, blank=False)
    access_token = models.CharField(max_length=1024, blank=False)
    name = models.CharField(max_length=1024, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    institution_id = models.CharField(max_length=1024, blank=False)
    institution_name = models.CharField(max_length=1024, blank=False)
    balance = MoneyField(default_currency='GBP', decimal_places=2, max_digits=11)