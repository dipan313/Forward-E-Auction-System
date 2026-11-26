
from rest_framework import serializers

from .models import (
    User,
    AuctionEvent,
    AuctionLot,
    Bid,
    AuctionResult
)


# USER SERIALIZER
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'


# AUCTION EVENT SERIALIZER
class AuctionEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = AuctionEvent
        fields = '__all__'


# AUCTION LOT SERIALIZER
class AuctionLotSerializer(serializers.ModelSerializer):

    class Meta:
        model = AuctionLot
        fields = '__all__'


# BID SERIALIZER
class BidSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bid
        fields = '__all__'


# AUCTION RESULT SERIALIZER
class AuctionResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = AuctionResult
        fields = '__all__'
