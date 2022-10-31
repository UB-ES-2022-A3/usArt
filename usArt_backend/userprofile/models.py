from django.db import models

# Create your models here.
class PurchaseHistory(models.Model):
    publication_title = models.CharField(max_length=100)
    author = models.CharField(max_length=200)
    price = models.FloatField()
    user_id = models.IntegerField()
    date = models.DateField()

    class Meta:
        ordering = ['publication_title', 'author']

"""
class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    rate = models.IntegerField(default=0)
"""


