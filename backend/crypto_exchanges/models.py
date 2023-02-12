from django.db import models
from accounts.models import User


# Create your models here.

class BinanceAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    api_key = models.CharField(max_length=255)
    secret_key = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    