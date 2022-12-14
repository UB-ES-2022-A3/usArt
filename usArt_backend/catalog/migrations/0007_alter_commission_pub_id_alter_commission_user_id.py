# Generated by Django 4.1.2 on 2022-11-30 22:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("catalog", "0006_alter_publicationimage_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="commission",
            name="pub_id",
            field=models.ForeignKey(
                db_constraint=False,
                db_index=False,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="publication",
                to="catalog.publication",
            ),
        ),
        migrations.AlterField(
            model_name="commission",
            name="user_id",
            field=models.ForeignKey(
                db_constraint=False,
                db_index=False,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="commission",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
