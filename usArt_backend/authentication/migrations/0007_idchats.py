# Generated by Django 4.1.2 on 2022-11-27 15:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0006_alter_usartuser_photo"),
    ]

    operations = [
        migrations.CreateModel(
            name="idChats",
            fields=[
                (
                    "id_sala",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "id_1",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user1",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "id_2",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user2",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
