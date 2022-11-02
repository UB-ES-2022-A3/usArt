from django.db import models


def user_directory_path(instance, filename):
    return 'images/{0}'.format(filename)


class Publication(models.Model):

    title = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=200, blank=True)
    author = models.CharField(max_length=150, blank=False)
    price = models.FloatField()
    review = models.FloatField()
    tag = models.IntegerField(default = 1)

    class Meta:
        ordering = ['title', 'description', 'author', 'tag', 'price', 'review']


class PublicationImage(models.Model):
    
    image = models.ImageField(upload_to=user_directory_path, default='images/default.jpg')
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='images')
        


