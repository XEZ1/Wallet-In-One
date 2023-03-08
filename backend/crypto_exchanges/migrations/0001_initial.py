# Generated by Django 4.1.5 on 2023-03-03 20:47

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CryptoExchangeAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('crypto_exchange_name', models.CharField(max_length=255)),
                ('api_key', models.CharField(max_length=255)),
                ('secret_key', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('asset', models.CharField(max_length=5)),
                ('free_amount', models.FloatField(validators=[django.core.validators.MinValueValidator(0.0)])),
                ('locked_amount', models.FloatField(validators=[django.core.validators.MinValueValidator(0.0)])),
                ('crypto_exchange_object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='crypto_exchanges.cryptoexchangeaccount')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
