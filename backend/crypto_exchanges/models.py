from django.db import models
from accounts.models import User

# Create your models here.

class BinanceAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=100)

class Token(models.Model):
    account = models.ForeignKey(BinanceAccount, on_delete=models.CASCADE)
    asset = models.CharField(max_length=50)
    free = models.FloatField()
    locked = models.FloatField()
    