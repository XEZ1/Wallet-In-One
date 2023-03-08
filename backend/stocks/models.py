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
    institution_logo = models.CharField(max_length=10000)


class Stock(models.Model):
    stockAccount = models.ForeignKey(StockAccount, on_delete=models.CASCADE, blank=False)
    institution_price = MoneyField(default_currency='GBP', decimal_places=2, max_digits=11)
    name = models.CharField(max_length=1024, blank=False)
    ticker_symbol = models.CharField(max_length=1024, blank=False)
    quantity = models.FloatField()

# class Location(models.Model):
#     address = models.CharField(max_length=100, default=None, blank=True, null=True)
#     city = models.CharField(max_length=100, default=None, blank=True, null=True)
#     region = models.CharField(max_length=50, default=None, blank=True, null=True)
#     postal_code = models.CharField(max_length=100, default=None, blank=True, null=True)
#     country = models.CharField(max_length=50, default=None, blank=True, null=True)
#     lat = models.FloatField(default=None, blank=True, null=True)
#     lon = models.FloatField(default=None, blank=True, null=True)
#     store_number = models.CharField(max_length=100, default=None, blank=True, null=True)

class Transaction(models.Model):
    stock = models.ForeignKey(StockAccount, on_delete=models.CASCADE, blank=False)
    account_id = models.CharField(max_length=100, blank=False, null=False)
    amount = models.FloatField(blank=False,null=False) #  Positive values when money moves out of the account; negative values when money moves in.
    quantity = models.FloatField(blank=False,null=False) 
    price = models.FloatField(blank=False,null=False) 
    fees = models.FloatField(blank=False,null=True) 
    # cancel_transaction_id = models.CharField(max_length=100, blank=False, null=False, unique=True)
    iso_currency_code = models.CharField(max_length=30, blank=False, null=True)
    # Always null if unofficial_currency_code is non-null.
    unofficial_currency_code = models.CharField(max_length=100, blank=False, null=True)
    # Always null if iso_currency_code is non-null.
    # Unofficial currency codes are used for currencies that do not have official ISO currency codes,
    # such as cryptocurrencies and the currencies of certain countries.
    # category = models.JSONField(encoder=None)
    # category_id = models.CharField(max_length=50, blank=False, null=False)
    date = models.DateField(blank=False, null=False)
    datetime = models.DateTimeField(blank=True, null=True)
    authorized_date = models.DateField(blank=True, null=True)
    authorized_datetime = models.DateTimeField(blank=True, null=True)
    # location = models.JSONField(encoder=None)#models.ForeignKey(Location, on_delete = models.CASCADE)
    name = models.CharField(max_length=100, blank=False, null=False)
    merchant_name = models.CharField(max_length=50, blank=True, null=True)
    # payment_channel = models.CharField(
    #     max_length=20,
    #     blank=False,
    #     null=False,
    #     choices=(
    #         ("online", "Online"), # transactions that took place online.
    #         ("in store", "In Store"), # transactions that were made at a physical location.
    #         ("other", "Other") # transactions that relate to banks, e.g. fees or deposits.
    #     )
    # )
    # pending = models.BooleanField(blank=False,null=False)
    pending_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    account_owner = models.CharField(max_length=50, blank=True, null=True)
    investment_transaction_id = models.CharField(max_length=100, blank=False, null=False, unique=True)#transaction_id = models.CharField(max_length=100, blank=False, null=False, unique=True)
    security_id = models.CharField(max_length=100, blank=False, null=False)
    transaction_code = models.CharField(
        max_length=30,
        blank=True, 
        null=True,
        choices= (
            ("adjustment", "Adjustment"), # Bank adjustment.
            ("atm", "ATM"), # Cash deposit or withdrawal via an automated teller machine.
            ("bank charge", "Bank charge"), # Charge or fee levied by the institution.
            ("bill payment", "Bill payment"), # Payment of a bill.
            ("cash", "Cash"), # Cash deposit or withdrawal.
            ("cashback", "Cashback"), # Cash withdrawal while making a debit card purchase.
            ("cheque", "Cheque"), # Document ordering the payment of money to another person or organization.
            ("direct debit", "Direct debit"), # Automatic withdrawal of funds initiated by a third party at a regular interval.
            ("interest", "Interest"), # Interest earned or incurred.
            ("purchase", "Purchase"), # Purchase made with a debit or credit card.
            ("standing order", "Standing order"), # Payment instructed by the account holder to a third party at a regular interval.
            ("transfer", "Transfer") # Transfer of money between accounts.
        )
    )
    # The transaction_code field is only populated for European institutions. For institutions in the US and Canada, this field is set to null.
    # transaction_type = models.CharField(
    #     max_length=30,
    #     blank=False,
    #     null=False,
    #     choices = (
    #         ("investment", "Investment"), # Investment account. In API versions 2018-05-22 and earlier, this type is called brokerage instead.
    #         ("credit", "Credit"), #  Credit card.
    #         ("depository", "Depository"), #  Depository account.
    #         ("loan", "Loan") # Loan account
    #     )
    # )

