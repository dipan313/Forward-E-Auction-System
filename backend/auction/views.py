
from django.utils import timezone
from django.db import transaction

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response

from .models import User, AuctionEvent, AuctionLot, Bid, AuctionResult
from .serializers import (
    AuctionEventSerializer,
    AuctionLotSerializer,
    BidSerializer,
    AuctionResultSerializer
)


# 1. REGISTER USER
@api_view(["POST"])
def register_user(request):

    data = request.data
    if data["role"] not in ["BUYER", "SELLER"]:
        return Response({"message": "Invalid role"})
    user = User.objects.create_user(**data)

    return Response({"message": "Register successfully"})


# 2. CREATE AUCTION EVENT
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_auction_event(request):

    if request.user.role != "SELLER":
        return Response({"message": "Only sellers can create auctions"}, status=403)

    serializer = AuctionEventSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(
            seller=request.user,
            status="DRAFT",
            is_approved=False,
            approved_by=None
        )

        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


# UPDATE AUCTION STATUS
def update_auction_status():

    current_time = timezone.now()

    events = AuctionEvent.objects.filter(is_approved=True)

    for event in events:

        if current_time >= event.end_time:
            event.status = "CLOSED"

        elif current_time >= event.start_time:
            event.status = "LIVE"

        else:
            event.status = "SCHEDULED"

        event.save(update_fields=["status"])


# 3. LIST AUCTION EVENTS
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_auction_event(request):

    update_auction_status()

    if request.user.is_staff:
        events = AuctionEvent.objects.all()

    elif request.user.role == "SELLER":
        events = AuctionEvent.objects.filter(seller=request.user)

    else:
        events = AuctionEvent.objects.filter(is_approved=True)

    serializer = AuctionEventSerializer(events, many=True)

    return Response(serializer.data)


# 4. CREATE AUCTION LOT
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_auction_lot(request):

    try:
        event = AuctionEvent.objects.get(id=request.data.get("auction_event"))

    except AuctionEvent.DoesNotExist:
        return Response({"message": "Auction not found"}, status=404)

    if event.seller != request.user:
        return Response({"message": "You cannot add lots to this auction"}, status=403)

    if event.status != "DRAFT":
        return Response({"message": "Auction is not in draft status"}, status=400)

    serializer = AuctionLotSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(is_published=False)

        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


# 5. APPROVE AUCTION EVENT
@api_view(["POST"])
@permission_classes([IsAdminUser])
def approve_auction_event(request, event_id):

    try:
        event = AuctionEvent.objects.get(id=event_id)

    except AuctionEvent.DoesNotExist:
        return Response({"message": "Auction not found"}, status=404)

    if event.is_approved:
        return Response({"message": "Already approved"}, status=400)

    if event.end_time <= timezone.now():
        return Response({"message": "Auction has already ended"}, status=400)

    event.is_approved = True
    event.approved_by = request.user

    if event.start_time > timezone.now():
        event.status = "SCHEDULED"

    else:
        event.status = "LIVE"

    event.save()

    event.lots.update(is_published=True)

    return Response(AuctionEventSerializer(event).data)


# 6. LIST AUCTION LOTS
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_auction_lot(request):

    update_auction_status()

    if request.user.is_staff:
        lots = AuctionLot.objects.all()

    elif request.user.role == "SELLER":
        lots = AuctionLot.objects.filter(auction_event__seller=request.user)

    else:
        lots = AuctionLot.objects.filter(
            auction_event__is_approved=True,
            is_published=True
        )

    data = AuctionLotSerializer(lots, many=True).data

    # Hide reserve price from buyers
    if request.user.role == "BUYER" and not request.user.is_staff:

        for lot in data:
            lot.pop("reserve_price", None)

    return Response(data)


# 7. PLACE BID
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def place_bid(request):

    update_auction_status()

    if request.user.role != "BUYER" or request.user.is_staff:
        return Response({"message": "Only buyers can bid"}, status=403)

    serializer = BidSerializer(data=request.data)

    if serializer.is_valid():

        lot = serializer.validated_data["auction_lot"]
        amount = serializer.validated_data["bid_amount"]

        with transaction.atomic():

            lot = AuctionLot.objects.select_for_update().get(id=lot.id)

            event = lot.auction_event
            current_time = timezone.now()

            if event.seller == request.user:
                return Response({"message": "You cannot bid on your own auction"}, status=400)

            if not event.is_approved or not lot.is_published:
                return Response({"message": "Lot is not available"}, status=400)

            if current_time < event.start_time:
                return Response({"message": "Auction has not started yet"}, status=400)

            if current_time >= event.end_time:
                return Response({"message": "Auction has ended"}, status=400)

            if event.status != "LIVE":
                return Response({"message": "Auction is not live"}, status=400)

            highest = Bid.objects.filter(
                auction_lot=lot
            ).order_by("-bid_amount").first()

            if highest:
                minimum_bid = highest.bid_amount + lot.minimum_increment

            else:
                minimum_bid = lot.starting_price

            if amount < minimum_bid:
                return Response({
                    "message": "Bid amount is too low",
                    "minimum_bid": str(minimum_bid)
                }, status=400)

            bid = serializer.save(bidder=request.user)

        return Response(BidSerializer(bid).data, status=201)

    return Response(serializer.errors, status=400)


# 8. GET HIGHEST BID
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def highest_bid(request):

    lot_id = request.query_params.get("lot_id")

    if not lot_id:
        return Response({"message": "Please provide lot_id"}, status=400)

    highest = Bid.objects.filter(
        auction_lot_id=lot_id
    ).order_by("-bid_amount").first()

    if highest is None:
        return Response({"message": "No bids yet"})

    return Response(BidSerializer(highest).data)


# 9. SEE ALL BIDS (ADMIN)
@api_view(["GET"])
@permission_classes([IsAdminUser])
def see_bid(request):

    bids = Bid.objects.all().order_by("-bid_time")

    return Response(BidSerializer(bids, many=True).data)


# 10. GET AUCTION EVENT BY ID
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_event_by_id(request, event_id):

    update_auction_status()

    try:
        event = AuctionEvent.objects.get(id=event_id)

    except AuctionEvent.DoesNotExist:
        return Response({"message": "Auction not found"}, status=404)

    if not request.user.is_staff and event.seller != request.user and not event.is_approved:
        return Response({"message": "You cannot view this auction"}, status=403)

    return Response(AuctionEventSerializer(event).data)


# 11. GET AUCTION RESULT
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def auction_result(request, event_id):

    update_auction_status()

    try:
        event = AuctionEvent.objects.get(id=event_id)

    except AuctionEvent.DoesNotExist:
        return Response({"message": "Auction not found"}, status=404)

    if not request.user.is_staff and event.seller != request.user and not event.is_approved:
        return Response({"message": "You cannot view this result"}, status=403)

    if timezone.now() < event.end_time:
        return Response({"message": "Auction has not ended yet"}, status=400)

    for lot in event.lots.all():

        highest = Bid.objects.filter(
            auction_lot=lot
        ).order_by("-bid_amount").first()

        if highest is None:

            AuctionResult.objects.get_or_create(
                auction_lot=lot,
                defaults={"is_sold": False}
            )

        else:

            if lot.reserve_price is not None and highest.bid_amount < lot.reserve_price:

                AuctionResult.objects.get_or_create(
                    auction_lot=lot,
                    defaults={"is_sold": False}
                )

            else:

                AuctionResult.objects.get_or_create(
                    auction_lot=lot,
                    defaults={
                        "winning_bid": highest,
                        "winner": highest.bidder,
                        "final_price": highest.bid_amount,
                        "is_sold": True
                    }
                )

    results = AuctionResult.objects.filter(
        auction_lot__auction_event=event
    )

    return Response(AuctionResultSerializer(results, many=True).data)


# 12. SEE MY BIDS
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_bid(request):

    bids = Bid.objects.filter(
        bidder=request.user
    ).order_by("-bid_time")

    return Response(BidSerializer(bids, many=True).data)


# 13. LIST ALL USERS (ADMIN)
@api_view(["GET"])
@permission_classes([IsAdminUser])
def list_users(request):

    users = User.objects.filter(
        role__in=["BUYER", "SELLER"],
        is_staff=False
    ).values(
        "id",
        "username",
        "email",
        "mobile",
        "role"
    )

    return Response(list(users))