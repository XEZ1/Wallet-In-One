# Generated by Django 4.1.5 on 2023-02-13 06:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crypto_exchanges', '0002_remove_binanceaccount_access_token_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Token',
        ),
    ]
