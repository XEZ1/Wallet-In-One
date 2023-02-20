from django.db import models
from accounts.models import User


class StockAccount(models.Model):
    account_id = models.CharField(max_length=1024, primary_key=True)
    name = models.CharField(max_length=1024)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    institution_id = models.CharField(max_length=1024)
    institution_name = models.CharField(max_length=1024)