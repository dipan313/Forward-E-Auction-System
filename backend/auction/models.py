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
    
class Bid(models.Model):

    auction_lot = models.ForeignKey(
        AuctionLot,
        on_delete=models.CASCADE,
        related_name='bids'
    )

    bidder = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bids'
    )

    bid_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    bid_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bidder.username} - {self.bid_amount}"


class AuctionResult(models.Model):

    auction_lot = models.OneToOneField(
        AuctionLot,
        on_delete=models.CASCADE,
        related_name='result'
    )

    winning_bid = models.ForeignKey(
        Bid,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='winning_results'
    )

    winner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='auction_wins'
    )

    final_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    is_sold = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.auction_lot.title

