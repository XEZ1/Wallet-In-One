# Generated by Django 4.1.5 on 2023-01-28 22:19

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_alter_user_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=15, unique=True, validators=[django.core.validators.RegexValidator(message='Username must contain at least 4 alphabetical characters', regex='^(?=.*[a-zA-Z]{4,}).*$')]),
        ),
    ]
