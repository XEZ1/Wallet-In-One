# Generated by Django 4.1.5 on 2023-03-06 21:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='stockaccount',
            name='institution_logo',
            field=models.CharField(default=1, max_length=10000),
            preserve_default=False,
        ),
    ]
