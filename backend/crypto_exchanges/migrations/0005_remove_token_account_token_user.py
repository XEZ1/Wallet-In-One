# Generated by Django 4.1.5 on 2023-02-14 21:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('crypto_exchanges', '0004_alter_binanceaccount_user_token'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='token',
            name='account',
        ),
        migrations.AddField(
            model_name='token',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
