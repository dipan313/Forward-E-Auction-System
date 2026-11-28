
from django.urls import path

from .views import register_user, create_auction_event,create_auction_lot,list_auction_event,list_auction_lot,get_event_by_id,approve_auction_event,place_bid,highest_bid,see_bid,auction_result, my_bid
from .views import list_users

urlpatterns = [

    # User
    path('register/', register_user),
    path('users/', list_users),

    # Auction events
    path('events/create/', create_auction_event),
    path('events/', list_auction_event),
    path('events/<int:event_id>/', get_event_by_id),
    path('events/<int:event_id>/approve/', approve_auction_event),
    # Auction lots
    path('lots/create/', create_auction_lot),
    path('lots/', list_auction_lot),

    # Bidding
    path('bids/place/', place_bid),
    path('bids/highest/', highest_bid),
    path('bids/all/', see_bid),
    path('bids/my/',my_bid),

    # Auction results
    path('events/<int:event_id>/result/', auction_result),

]
