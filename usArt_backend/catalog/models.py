from django.db import models
from authentication.models import UsArtUser
import uuid


def user_directory_path(instance, filename):
    return 'images/{0}'.format(filename)


class Publication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=200, blank=True)
    author = models.ForeignKey(UsArtUser, on_delete=models.CASCADE, related_name='author')
    price = models.FloatField()
    review = models.FloatField()
    tag = models.IntegerField(default = 1)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title', 'description', 'price', 'review']


class PublicationImage(models.Model):
    
    image = models.ImageField(upload_to=user_directory_path, default='images/default.jpg')
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='images')



