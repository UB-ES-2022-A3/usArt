# Generated by Django 4.1.2 on 2022-11-17 20:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("catalog", "0003_alter_publication_options_alter_publication_author_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Auction",
            fields=[
                (
                    "pub_id",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name="auctions",
                        serialize=False,
                        to="catalog.publication",
                    ),
                ),
                (
                    "staus",
                    models.CharField(
                        choices=[("OP", "Open"), ("CL", "Closed")],
                        default="OP",
                        max_length=2,
                    ),
                ),
                ("closure_date", models.DateTimeField()),
                ("min_bid", models.FloatField(default=0.0)),
                ("stock", models.IntegerField()),
                ("last_updated", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AlterModelOptions(
            name="publication",
            options={"ordering": ["title", "description", "price", "author", "type"]},
        ),
        migrations.RemoveField(model_name="publication", name="review",),
        migrations.RemoveField(model_name="publication", name="tag",),
        migrations.AddField(
            model_name="publication",
            name="creation_date",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="publication",
            name="last_updated",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="publication",
            name="type",
            field=models.CharField(
                choices=[("CO", "Commission"), ("AR", "Art"), ("AU", "Auction")],
                default="AR",
                max_length=2,
            ),
        ),
        migrations.AlterField(
            model_name="publication",
            name="description",
            field=models.CharField(max_length=200),
        ),
        migrations.CreateModel(
            name="Commission",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("description", models.TextField()),
                ("creation_date", models.DateField(auto_now_add=True)),
                ("last_updated", models.DateField(auto_now=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PD", "Pending"),
                            ("AC", "Accepted"),
                            ("DD", "Denied"),
                            ("DO", "Done"),
                        ],
                        default="PD",
                        max_length=2,
                    ),
                ),
                (
                    "pub_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="publication",
                        to="catalog.publication",
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="commission",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Bid",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("bid", models.FloatField()),
                ("date", models.DateTimeField(auto_now=True)),
                (
                    "auc_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="bids",
                        to="catalog.auction",
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="bidder",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="commission",
            constraint=models.UniqueConstraint(
                fields=("pub_id", "user_id"),
                name="unique_publication_user_commission_combination",
            ),
        ),
        migrations.AddConstraint(
            model_name="bid",
            constraint=models.UniqueConstraint(
                fields=("auc_id", "user_id"), name="unique_auction_user_combination"
            ),
        ),
    ]