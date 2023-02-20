

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='StockAccount',
            fields=[
                ('account_id', models.CharField(max_length=1024, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=1024)),

                ('institution_id', models.CharField(max_length=1024)),
                ('institution_name', models.CharField(max_length=1024)),

                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stock_accounts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
