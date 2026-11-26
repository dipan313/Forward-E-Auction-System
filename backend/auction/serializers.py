from .models import (
    User,
    AuctionEvent,
    AuctionLot,
    Bid,
    AuctionResult
)

from rest_framework import serializers


# USER SERIALIZER
class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User

        fields = [
            'id',
            'username',
            'email',
            'password',
            'role',
            'mobile'
        ]

        read_only_fields = ['id', 'role']

    def create(self, validated_data):

        password = validated_data.pop('password')

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user


# AUCTION EVENT SERIALIZER
class AuctionEventSerializer(serializers.ModelSerializer):

    seller_name = serializers.CharField(
        source='seller.username',
        read_only=True
    )

    class Meta:
        model = AuctionEvent

        fields = [
            'id',
            'seller',
            'seller_name',
            'approved_by',
            'title',
            'description',
            'start_time',
            'end_time',
            'status',
            'is_approved',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'seller',
            'approved_by',
            'status',
            'is_approved',
            'created_at',
            'updated_at'
        ]

    def validate(self, data):

        start_time = data.get(
            'start_time',
            getattr(self.instance, 'start_time', None)
        )

        end_time = data.get(
            'end_time',
            getattr(self.instance, 'end_time', None)
        )

        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError(
                "End time must be after start time."
            )

        return data


# AUCTION LOT SERIALIZER
class AuctionLotSerializer(serializers.ModelSerializer):

    class Meta:
        model = AuctionLot

        fields = [
            'id',
            'auction_event',
            'title',
            'description',
            'quantity',
            'starting_price',
            'minimum_increment',
            'reserve_price',
            'is_published',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'is_published',
            'created_at',
            'updated_at'
        ]

    def validate(self, data):

        starting_price = data.get(
            'starting_price',
            getattr(self.instance, 'starting_price', None)
        )

        minimum_increment = data.get(
            'minimum_increment',
            getattr(self.instance, 'minimum_increment', None)
        )

        reserve_price = data.get(
            'reserve_price',
            getattr(self.instance, 'reserve_price', None)
        )

        quantity = data.get(
            'quantity',
            getattr(self.instance, 'quantity', 1)
        )

        if starting_price is not None and starting_price <= 0:
            raise serializers.ValidationError(
                "Starting price must be greater than zero."
            )

        if minimum_increment is not None and minimum_increment <= 0:
            raise serializers.ValidationError(
                "Minimum increment must be greater than zero."
            )

        if quantity is not None and quantity <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than zero."
            )

        if (
            reserve_price is not None
            and starting_price is not None
            and reserve_price < starting_price
        ):
            raise serializers.ValidationError(
                "Reserve price cannot be lower than starting price."
            )

        return data


# BID SERIALIZER
class BidSerializer(serializers.ModelSerializer):

    bidder_name = serializers.CharField(
        source='bidder.username',
        read_only=True
    )

    class Meta:
        model = Bid

        fields = [
            'id',
            'auction_lot',
            'bidder',
            'bidder_name',
            'bid_amount',
            'bid_time'
        ]

        read_only_fields = [
            'id',
            'bidder',
            'bidder_name',
            'bid_time'
        ]

    def validate_bid_amount(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Bid amount must be greater than zero."
            )

        return value


# AUCTION RESULT SERIALIZER
class AuctionResultSerializer(serializers.ModelSerializer):

    winner_name = serializers.CharField(
        source='winner.username',
        read_only=True
    )

    class Meta:
        model = AuctionResult

        fields = [
            'id',
            'auction_lot',
            'winning_bid',
            'winner',
            'winner_name',
            'final_price',
            'is_sold',
            'created_at'
        ]

        read_only_fields = [
            'id',
            'auction_lot',
            'winning_bid',
            'winner',
            'winner_name',
            'final_price',
            'is_sold',
            'created_at'
        ]