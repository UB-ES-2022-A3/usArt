# Generated by Django 4.1.2 on 2022-10-30 22:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0002_publicationimage_test'),
    ]

    operations = [
        migrations.DeleteModel(
            name='PublicationImage',
        ),
    ]