# Generated by Django 4.1.2 on 2022-11-02 22:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PurchaseHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('publication_title', models.CharField(max_length=100)),
                ('author', models.CharField(max_length=200)),
                ('price', models.FloatField()),
                ('user_id', models.IntegerField()),
                ('user', models.CharField(max_length=100)),
                ('date', models.DateField()),
            ],
            options={
                'ordering': ['publication_title', 'author'],
            },
        ),
    ]
