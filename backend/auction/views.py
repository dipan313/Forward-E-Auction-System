from django.utils import timezone
from django.db import transaction

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .models import (
    User,
    AuctionEvent,
    AuctionLot,
    Bid,
    AuctionResult
)

from .serializers import (
    UserSerializer,
    AuctionEventSerializer,
    AuctionLotSerializer,
    BidSerializer,
    AuctionResultSerializer
)


# 1. REGISTER USER
@api_view(['POST'])
def register_user(request):

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():

        user_data = serializer.validated_data.copy()

        password = user_data.pop('password')

        # Users cannot assign themselves special privileges
        user_data.pop('role', None)
        user_data.pop('is_staff', None)
        user_data.pop('is_superuser', None)
        user_data.pop('is_active', None)

        user = User.objects.create_user(
            password=password,
            role='BUYER',
            is_staff=False,
            is_superuser=False,
            **user_data
        )

        return Response(
            {"message": "Registration successful."},
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# 2. CREATE AUCTION EVENT
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_auction_event(request):

    serializer = AuctionEventSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(
            seller=request.user,
            status='DRAFT',
            is_approved=False,
            approved_by=None
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# UPDATE AUCTION STATUS
def update_auction_status():

    current_time = timezone.now()

    events = AuctionEvent.objects.filter(
        is_approved=True
    )

    for event in events:

        if current_time >= event.end_time:
            event.status = 'CLOSED'

        elif current_time >= event.start_time:
            event.status = 'LIVE'

        else:
            event.status = 'SCHEDULED'

        event.save()

# 3. LIST AUCTION EVENTS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_auction_event(request):

    update_auction_status()
    if request.user.is_staff:
        events = AuctionEvent.objects.all()

    elif request.user.role == 'SELLER':
        events = AuctionEvent.objects.filter(
            seller=request.user
        )

    else:
        events = AuctionEvent.objects.filter(
            is_approved=True
        )

    serializer = AuctionEventSerializer(events, many=True)

    return Response(serializer.data)


# 4. CREATE AUCTION LOT
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_auction_lot(request):

    event_id = request.data.get('auction_event')

    try:
        event = AuctionEvent.objects.get(id=event_id)

    except AuctionEvent.DoesNotExist:
        return Response(
            {"error": "Auction event not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if event.seller != request.user:
        return Response(
            {"error": "You can only add lots to your own auction."},
            status=status.HTTP_403_FORBIDDEN
        )

    if event.status != 'DRAFT':
        return Response(
            {"error": "You can only add lots to draft auctions."},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = AuctionLotSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(is_published=False)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# 5. APPROVE AUCTION EVENT
@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_auction_event(request, event_id):

    try:
        event = AuctionEvent.objects.get(id=event_id)

    except AuctionEvent.DoesNotExist:
        return Response(
            {"error": "Auction event not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if event.is_approved:
        return Response(
            {"error": "Auction is already approved."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if event.end_time <= timezone.now():
        return Response(
            {"error": "Auction end time has already passed."},
            status=status.HTTP_400_BAD_REQUEST
        )

    event.is_approved = True
    event.approved_by = request.user

    if event.start_time > timezone.now():
        event.status = 'SCHEDULED'
    else:
        event.status = 'LIVE'

    event.save()

    event.lots.update(is_published=True)

    serializer = AuctionEventSerializer(event)

    return Response(serializer.data)