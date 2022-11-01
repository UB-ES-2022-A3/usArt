from django.db import models

# Create your models here.
class Publication(models.Model):
    title = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=200, blank=True)
    author = models.CharField(max_length=150, blank=False)
    price = models.FloatField()
    tag = models.IntegerField(default = 1)

    class Meta:
        ordering = ['title', 'description', 'author', 'tag']
        
"""
class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    rate = models.IntegerField(default=0)
"""


