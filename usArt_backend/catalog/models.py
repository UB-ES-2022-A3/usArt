from django.db import models


class Publication(models.Model):
    title = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=200, blank=True)
    author = models.CharField(max_length=150, blank=False)
    price = models.FloatField()
    review = models.FloatField()

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title', 'description', 'author', 'price']
