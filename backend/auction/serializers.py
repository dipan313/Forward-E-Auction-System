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


