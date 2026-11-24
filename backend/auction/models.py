from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    role = models.CharField(
        max_length=10,
        default='BUYER'
    )
    mobile = models.CharField(max_length=10)
    def __str__(self):
        return self.username

class AuctionEvent(models.Model):

    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SCHEDULED', 'Scheduled'),
        ('LIVE', 'Live'),
        ('CLOSED', 'Closed'),
    ]

    seller = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='auction_events'
    )

    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_events'
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    start_time = models.DateTimeField()

    end_time = models.DateTimeField()

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='DRAFT'
    )

    is_approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    #added auctionlot 
class AuctionLot(models.Model):

    auction_event = models.ForeignKey(
        AuctionEvent,
        on_delete=models.CASCADE,
        related_name='lots'
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    quantity = models.PositiveIntegerField(default=1)

    starting_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    minimum_increment = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    reserve_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
