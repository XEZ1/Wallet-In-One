# Generated by Django 4.1.5 on 2023-02-12 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('banking', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.CharField(max_length=1024, primary_key=True, serialize=False)),
                ('requisition_id', models.CharField(max_length=1024)),
            ],
        ),
    ]