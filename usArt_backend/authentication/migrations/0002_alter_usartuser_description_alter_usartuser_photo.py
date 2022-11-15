# Generated by Django 4.1.2 on 2022-11-15 18:55

import authentication.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usartuser",
            name="description",
            field=models.TextField(default=""),
        ),
        migrations.AlterField(
            model_name="usartuser",
            name="photo",
            field=models.ImageField(
                default="photos/default.jpg",
                upload_to=authentication.models.upload_to_photo,
            ),
        ),
    ]