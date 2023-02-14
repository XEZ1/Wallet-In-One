from django.db import models
import datetime
from django.utils import timezone
from accounts.models import User
from djmoney.models.fields import MoneyField
from djmoney.money import Money

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
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bank_accounts')
    requisition_id = models.CharField(max_length=1024)
    last_update = models.DateTimeField(null=True)
    #balance = MoneyField( decimal_places=2, default_currency='GBP', max_digits=11)

    # Updates transactions if they haven't been updated for 24 hours
    def can_update(self):
        if (self.last_update == None or timezone.now().date() > self.last_update.date()):
            self.last_update = timezone.now()
            self.save()
            return True
        else:
            return False

    # Adds transaction data from the Nordigen API
    def add_transactions(self, data):
        for t in data:
            if Transaction.objects.filter(id=t['internalTransactionId']).exists():
                pass
            else:
                Transaction(
                    account = self,
                    id = t['internalTransactionId'],
                    time = t.get('bookingDateTime') or t.get('bookingDate'),
                    amount = Money(t['transactionAmount']['amount'], t['transactionAmount']['currency']),
                    info = t['remittanceInformationUnstructured'],
                ).save()

    def add_balances(self, data):
        for b in data:

            amountData = b['balanceAmount']
            amount = Money(amountData["amount"], amountData["currency"])

            date = b.get("referenceDate") or timezone.now().date()

            search = Balance.search(self, amount.currency, date)
            if search.exists():
                balance = search.first()
                balance.amount = amount
                balance.save()
            else:
                Balance(account=self, amount=amount, date=date).save()

class Transaction(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    id = models.CharField(max_length=1024, primary_key=True)
    time = models.DateTimeField() #'bookingDate' or 'bookingDateTime'
    amount = MoneyField( decimal_places=2, default_currency='GBP', max_digits=11)
    info = models.CharField(max_length=4096)

class Balance(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='balances')
    amount = MoneyField(decimal_places=2, default_currency='GBP', max_digits=11) # Only GBP is supported right now
    date = models.DateField()

    def search(account, currency, date):
        return Balance.objects.all().filter(account=account, amount_currency=currency, date=date)