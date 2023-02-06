"""Models in the accounts app"""

from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
# Create your models here.

class User(AbstractUser):
    """User model used for authentication."""

    username = models.CharField(
        max_length=15,
        unique=True,
        validators=[RegexValidator(
            #regex=r'^@\w{3,}$',
            regex=r'^(?=.*[a-zA-Z]{4,}).*$',
            message='Username must contain at least 4 alphabetical characters'
        )]
    )
    first_name = models.CharField(
        max_length=15,
        blank=False
    )
    last_name = models.CharField(
        max_length=15,
        blank=False
    )
    email = models.EmailField(
        unique=True,
        max_length=25,
        blank=False
    )

class Location(models.Model):
    address = models.CharField(max_length=100, default=None, blank=True, null=True),
    city = models.CharField(max_length=100, default=None, blank=True, null=True),
    region = models.CharField(max_length=50, default=None, blank=True, null=True),
    postal_code = models.CharField(max_length=100, default=None, blank=True, null=True),
    country = models.CharField(max_length=50, default=None, blank=True, null=True),
    lat = models.FloatField(default=None, blank=True, null=True),
    lon = models.FloatField(default=None, blank=True, null=True),
    store_number = models.CharField(max_length=100, default=None, blank=True, null=True)

class Transactions(models.Model):
    account_id = models.CharField(max_length=100),
    amount = models.FloatField(), #  Positive values when money moves out of the account; negative values when money moves in.
    iso_currency_code = models.CharField(max_length=100), 
    # Always null if unofficial_currency_code is non-null.
    unofficial_currency_code = models.CharField(max_length=100), 
    # Always null if iso_currency_code is non-null.
    # Unofficial currency codes are used for currencies that do not have official ISO currency codes,
    # such as cryptocurrencies and the currencies of certain countries.
    category = ArrayField(default=None, blank=True, null=True),
    category_id = models.CharField(max_length=100, default=None, blank=True, null=True),
    date = models.DateField(),
    datetime = models.DateTimeField(default=None, blank=True, null=True),
    authorized_date = models.DateField(default=None, blank=True, null=True),
    authorized_datetime = models.DateTimeField(default=None, blank=True, null=True),
    location = models.ForeignKey(Location, on_delete = models.CASCADE),
    name = models.CharField(max_length=100),
    merchant_name = models.CharField(default=None, blank=True, null=True),
    payment_channel = models.CharField(
        choices=(
            ("online", "Online") # transactions that took place online.
            ("in store", "In Store") # transactions that were made at a physical location.
            ("other", "Other") # transactions that relate to banks, e.g. fees or deposits.
        )
    ),
    pending = models.BooleanField(),
    pending_transaction_id = models.CharField(default=None, blank=True, null=True),
    account_owner = models.CharField(default=None, blank=True, null=True),
    transaction_id = models.CharField(max_length=100, blank=False, unique=True),
    transaction_code = models.CharField(
        default=None,
        blank=True, 
        null=True, # This field is only populated for European institutions. For institutions in the US and Canada, this field is set to null.
        blank=False,
        choices= (
            ("adjustment", "Adjustment") # Bank adjustment.
            ("atm", "ATM") # Cash deposit or withdrawal via an automated teller machine.
            ("bank charge", "Bank charge") # Charge or fee levied by the institution.
            ("bill payment", "Bill payment") # Payment of a bill.
            ("cash", "Cash") # Cash deposit or withdrawal.
            ("cashback", "Cashback") # Cash withdrawal while making a debit card purchase.
            ("cheque", "Cheque") # Document ordering the payment of money to another person or organization.
            ("direct debit", "Direct debit") # Automatic withdrawal of funds initiated by a third party at a regular interval.
            ("interest", "Interest") # Interest earned or incurred.
            ("purchase", "Purchase") # Purchase made with a debit or credit card.
            ("standing order", "Standing order") # Payment instructed by the account holder to a third party at a regular interval.
            ("transfer", "Transfer") # Transfer of money between accounts.
        )
    ),
    transaction_type = models.CharField(
        choices = (
            ("digital", "Digital") # transactions that took place online.
            ("place", "Special") # transactions that were made at a physical location.
            ("special", "Special") # transactions that relate to banks, e.g. fees or deposits.
            ("unresolved", "Unresolved") # transactions that do not fit into the other three types.
        )
    )
