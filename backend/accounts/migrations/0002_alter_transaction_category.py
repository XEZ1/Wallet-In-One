# Generated by Django 4.1.5 on 2023-02-10 12:30

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='category',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(blank=True, max_length=100), blank=True, default=list, size=None),
        ),
    ]
