from django.db import models

# Create your models here.
class Publication(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    price = models.FloatField()

    class Meta:
        ordering = ['title', 'description', 'author']

"""
class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    rate = models.IntegerField(default=0)
"""


