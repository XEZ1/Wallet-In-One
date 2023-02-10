from django.db import models
from accounts.models import User

# Create your models here.

class Token(models.Model):
    asset = models.CharField(max_length=50)
    free = models.FloatField()
    locked = models.FloatField()
    