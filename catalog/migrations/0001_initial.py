# Generated by Django 4.1.2 on 2022-10-18 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=200)),
                ('author', models.CharField(max_length=200)),
                ('price', models.FloatField()),
            ],
            options={
                'ordering': ['title', 'description', 'author'],
            },
        ),
    ]
