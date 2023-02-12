from django.db import models
import datetime
from django.utils import timezone

# Create your models here.
class Token(models.Model):
    refresh_token = models.CharField(max_length=1024, primary_key=True)
    access_token = models.CharField(max_length=1024)
    refresh_token_expiration = models.DateTimeField()
    access_token_expiration = models.DateTimeField()

    def refresh_expired(self):
            now = timezone.now()
            return now >= self.refresh_token_expiration

    def access_expired(self):
        now = timezone.now()
        return now >= self.access_token_expiration

    def set_refresh_expiry(self, seconds):
        self.refresh_token_expiration = timezone.now() + datetime.timedelta(seconds=seconds)

    def set_access_expiry(self, seconds):
        self.access_token_expiration = timezone.now() + datetime.timedelta(seconds=seconds)

class Account(models.Model):
    id = models.CharField(max_length=1024, primary_key=True)
    requisition_id = models.CharField(max_length=1024)