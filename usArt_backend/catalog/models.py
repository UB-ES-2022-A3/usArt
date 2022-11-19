from django.db import models
from authentication.models import UsArtUser
import uuid


def user_directory_path(instance, filename):
    return 'images/{0}'.format(filename)


class Publication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=200, blank=False)
    author = models.ForeignKey(UsArtUser, on_delete=models.CASCADE, related_name='author')
    price = models.FloatField(blank=False)
    TYPE_CHOICES = [
        ('CO', 'Commission'),
        ('AR', 'Art'),
        ('AU', 'Auction')
    ]
    type = models.CharField(
        max_length=2,
        choices=TYPE_CHOICES,
        default='AR'
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title', 'description', 'price', 'author', 'type']


class PublicationImage(models.Model):
    image = models.ImageField(upload_to=user_directory_path, default='images/default.jpg')
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='images')


class Auction(models.Model):
    pub_id = models.OneToOneField(Publication, on_delete=models.CASCADE, primary_key=True, related_name='auctions')
    STATUS_CHOICES = [
        ('OP', 'Open'),
        ('CL', 'Closed')
    ]
    staus = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default='OP'
    )
    closure_date = models.DateTimeField()
    min_bid = models.FloatField(default=0.0)
    stock = models.IntegerField()
    last_updated = models.DateTimeField(auto_now=True)


class Bid(models.Model):
    auc_id = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name='bids')
    user_id = models.ForeignKey(UsArtUser, on_delete=models.CASCADE, related_name='bidder')
    bid = models.FloatField(blank=False)
    date = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['auc_id', 'user_id'], name='unique_auction_user_combination')
        ]


class Commission(models.Model):
    pub_id = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='publication')
    user_id = models.ForeignKey(UsArtUser, on_delete=models.CASCADE, related_name='commission')
    description = models.TextField(blank=False)
    creation_date = models.DateField(auto_now_add=True)
    last_updated = models.DateField(auto_now=True)
    STATUS_CHOICES = [
        ('PD', 'Pending'),
        ('AC', 'Accepted'),
        ('DD', 'Denied'),
        ('DO', 'Done')
    ]
    status = models.CharField(choices=STATUS_CHOICES, max_length=2, default='PD')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['pub_id', 'user_id'], name='unique_publication_user_commission_combination')
        ]
