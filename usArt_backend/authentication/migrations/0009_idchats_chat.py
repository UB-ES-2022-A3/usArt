# Generated by Django 4.1.2 on 2022-11-27 17:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0008_merge_0007_alter_usartuser_photo_0007_idchats"),
    ]

    operations = [
        migrations.AddField(
            model_name="idchats",
            name="chat",
            field=models.FileField(default="", upload_to="chats/"),
            preserve_default=False,
        ),
    ]
