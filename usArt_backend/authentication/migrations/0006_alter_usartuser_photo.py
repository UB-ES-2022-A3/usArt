# Generated by Django 4.1.2 on 2022-11-23 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0005_usartuser_creation_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usartuser",
            name="photo",
            field=models.ImageField(default="default.jpg", upload_to=""),
        ),
    ]
