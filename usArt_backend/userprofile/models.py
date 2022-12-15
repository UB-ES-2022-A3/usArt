from django.db import models
from catalog.models import Publication
from authentication.models import UsArtUser
import uuid


# Create your models here.
class PurchaseHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pub_id = models.ForeignKey(Publication, on_delete=models.SET_NULL, related_name='purchase', null=True)
    price = models.FloatField(blank=False)
    user_id = models.ForeignKey(UsArtUser, on_delete=models.CASCADE, related_name='customer')
    date = models.DateField(auto_now_add=True)
    address = models.CharField(max_length=1000,null=False)
    STATUS_CHOICES = [
        ('PR', 'Processing'),
        ('IT', 'In Transit'),
        ('DL', 'Delivered'),
        ('RE','Returned')
    ]
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default='PR'
    )

    def __str__(self):
        return str(self.price)


class Fav(models.Model):
    pub_id = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='Fav')
    user_id = models.ForeignKey(UsArtUser, on_delete=models.CASCADE, related_name='Faver')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['pub_id', 'user_id'], name='unique_publication_user_fav_combination'
            )
        ]


class Review(models.Model):
    reviewed_id = models.ForeignKey(UsArtUser, on_delete=models.CASCADE, related_name='reviewed')
    reviewer_id = models.ForeignKey(UsArtUser, on_delete=models.CASCADE, related_name='reviewer')
    stars = models.FloatField(blank=False)
    review = models.TextField()
    creation_date = models.DateField(auto_now_add=True)
    last_updated = models.DateField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['reviewer_id', 'reviewed_id'], name='unique_reviewer_reviewed_combination'
            )
        ]


class Block(models.Model):
    blocked_id = models.ForeignKey(UsArtUser, on_delete=models.CASCADE, related_name='blocked')
    blocker_id = models.ForeignKey(UsArtUser, on_delete=models.CASCADE, related_name='blocker')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['blocked_id', 'blocker_id'], name='unique_blocked_blocker_combination'
            )
        ]
