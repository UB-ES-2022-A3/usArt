# Generated by Django 4.1.4 on 2022-12-09 09:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('catalog', '0009_alter_commission_id_alter_commission_pub_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Complaint',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('reason', models.TextField()),
                ('creation_date', models.DateField(auto_now_add=True)),
                ('status', models.CharField(choices=[('PE', 'Pending'), ('AP', 'Aproved')], default='PE', max_length=2)),
                ('complainer_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='complained', to=settings.AUTH_USER_MODEL)),
                ('pub_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='complainer', to='catalog.publication')),
            ],
        ),
    ]
