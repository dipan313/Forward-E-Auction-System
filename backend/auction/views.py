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

# 6. LIST AUCTION LOTS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_auction_lot(request):

    update_auction_status()
    if request.user.is_staff:
        lots = AuctionLot.objects.all()

    elif request.user.role == 'SELLER':
        lots = AuctionLot.objects.filter(
            auction_event__seller=request.user
        )

    else:
        lots = AuctionLot.objects.filter(
            auction_event__is_approved=True,
            is_published=True
        )
    serializer = AuctionLotSerializer(lots, many=True)

    data = serializer.data

    if request.user.role == 'BUYER' and not request.user.is_staff:

        for lot in data:
            lot.pop('reserve_price', None)

    return Response(data)


# 7. PLACE BID
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_bid(request):
    update_auction_status()
    if request.user.role != 'BUYER' or request.user.is_staff:
        return Response(
            {"error": "Only buyers can place bids."},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = BidSerializer(data=request.data)

    if serializer.is_valid():

        lot = serializer.validated_data['auction_lot']
        bid_amount = serializer.validated_data['bid_amount']

        # Lock the lot while checking and saving the bid
        with transaction.atomic():

            lot = AuctionLot.objects.select_for_update().get(
                id=lot.id
            )

            event = lot.auction_event
            current_time = timezone.now()

            if event.seller == request.user:
                return Response(
                    {"error": "You cannot bid on your own auction."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not event.is_approved or not lot.is_published:
                return Response(
                    {"error": "This lot is not available for bidding."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if current_time < event.start_time:
                return Response(
                    {"error": "Auction has not started yet."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if current_time >= event.end_time:
                return Response(
                    {"error": "Auction has ended."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if event.status not in ['LIVE', 'SCHEDULED']:
                return Response(
                    {"error": "Auction is not active."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            highest_bid = Bid.objects.filter(
                auction_lot=lot
            ).order_by('-bid_amount').first()

            if highest_bid is None:
                minimum_bid = lot.starting_price
            else:
                minimum_bid = (
                    highest_bid.bid_amount + lot.minimum_increment
                )

            if bid_amount < minimum_bid:
                return Response(
                    {
                        "error": "Bid amount is too low.",
                        "minimum_bid": str(minimum_bid)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            bid = serializer.save(bidder=request.user)

        return Response(
            BidSerializer(bid).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# 8. GET HIGHEST BID
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def highest_bid(request):

    lot_id = request.query_params.get('lot_id')

    if not lot_id:
        return Response(
            {"error": "Please provide lot_id."},
            status=status.HTTP_400_BAD_REQUEST
        )

    highest = Bid.objects.filter(
        auction_lot_id=lot_id
    ).order_by('-bid_amount').first()

    if highest is None:
        return Response(
            {"message": "No bids placed yet."}
        )

    serializer = BidSerializer(highest)

    return Response(serializer.data)