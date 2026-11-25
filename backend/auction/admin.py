from django.contrib import admin
from .models import User,AuctionEvent,AuctionLot,AuctionResult,Bid
# Register your models here.
admin.site.register(User)
admin.site.register(AuctionEvent)
admin.site.register(AuctionLot)
admin.site.register(AuctionResult)
admin.site.register(Bid)