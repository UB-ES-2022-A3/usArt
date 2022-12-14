# Generated by Django 4.1.2 on 2022-11-15 19:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("catalog", "0002_publication_tag"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="publication",
            options={"ordering": ["title", "description", "price", "review"]},
        ),
        migrations.AlterField(
            model_name="publication",
            name="author",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="author",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="publication",
            name="id",
            field=models.UUIDField(
                default=uuid.uuid4, editable=False, primary_key=True, serialize=False
            ),
        ),
    ]
