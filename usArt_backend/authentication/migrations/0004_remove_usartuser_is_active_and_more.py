# Generated by Django 4.1.2 on 2022-11-17 20:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0003_alter_usartuser_id"),
    ]

    operations = [
        migrations.RemoveField(model_name="usartuser", name="is_active",),
        migrations.RemoveField(model_name="usartuser", name="is_artist",),
        migrations.AddField(
            model_name="usartuser",
            name="ban_date",
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name="usartuser",
            name="status",
            field=models.CharField(
                choices=[("BAN", "Banned"), ("ALO", "Allowed")],
                default="ALO",
                max_length=3,
            ),
        ),
        migrations.AddField(
            model_name="usartuser",
            name="unban_date",
            field=models.DateTimeField(null=True),
        ),
    ]
