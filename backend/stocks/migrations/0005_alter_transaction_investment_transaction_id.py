# Generated by Django 4.1.5 on 2023-03-23 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0004_alter_stock_institution_price_currency_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='investment_transaction_id',
            field=models.CharField(max_length=100),
        ),
    ]
