
import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button
} from "@mui/material";

import axios from "axios";
import { useRouter } from "next/router";

export default function LotDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [lot, setLot] = useState(null);
  const [auction, setAuction] = useState(null);
  const [highestBid, setHighestBid] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const headers = {
    Authorization: "Bearer " + (
      typeof window !== "undefined"
        ? localStorage.getItem("access")
        : ""
    )
  };

  const fetchAuction = async (auctionId) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/event/",
        { headers }
      );

      const selectedAuction = response.data.find(
        (item) => String(item.id) === String(auctionId)
      );

      setAuction(selectedAuction || null);
    } catch (error) {
      setAuction(null);
    }
  };

  const fetchLot = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/lots/",
        { headers }
      );

      const selectedLot = response.data.find(
        (item) => String(item.id) === String(id)
      );

      if (selectedLot) {
        setLot(selectedLot);
        fetchAuction(selectedLot.auction_event);
      } else {
        alert("Lot not found");
      }
    } catch (error) {
      alert("Unable to fetch lot details");
    }
  };

  const fetchHighestBid = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/bids/highest/?lot_id=" + id,
        { headers }
      );

      setHighestBid(response.data.bid_amount ?? null);
    } catch (error) {
      setHighestBid(null);
    }
  };

  useEffect(() => {
    if (router.isReady && id) {
      fetchLot();
      fetchHighestBid();
    }
  }, [router.isReady, id]);

  const placeBid = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/bids/place/",
        {
          auction_lot: id,
          bid_amount: bidAmount
        },
        { headers }
      );

      alert("Bid placed successfully");

      setBidAmount("");

      fetchHighestBid();
      fetchLot();
    } catch (error) {
      const data = error.response?.data;

      if (data?.minimum_bid) {
        alert(
          (data.message || "Bid is too low") +
          ". Minimum bid: ₹" +
          data.minimum_bid
        );
      } else {
        alert(data?.message || data?.detail || "Unable to place bid");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Lot Details / Live Bidding
      </Typography>

      {lot && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {lot.title}
            </Typography>

            <Typography gutterBottom>
              Lot ID: {lot.id}
            </Typography>

            <Typography gutterBottom>
              Description: {lot.description}
            </Typography>

            <Typography gutterBottom>
              Quantity: {lot.quantity}
            </Typography>

            <Typography gutterBottom>
              Starting Price: ₹{lot.starting_price}
            </Typography>

            <Typography gutterBottom>
              Minimum Increment: ₹{lot.minimum_increment}
            </Typography>

            <Typography gutterBottom>
              Highest Bid:{" "}
              {highestBid !== null
                ? "₹" + highestBid
                : "No bids yet"}
            </Typography>

            <Typography gutterBottom>
              Auction Status: {auction?.status || "Unavailable"}
            </Typography>
          </CardContent>
        </Card>
      )}

      {lot && (
        <form onSubmit={placeBid}>
          <Card sx={{ maxWidth: 500 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Place Your Bid
              </Typography>

              <TextField
                label="Enter Bid Amount"
                name="bid_amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0.01, step: 0.01 }}
              />
            </CardContent>

            <CardActions>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  auction?.status !== "LIVE" ||
                  submitting ||
                  !bidAmount ||
                  Number(bidAmount) <= 0
                }
              >
                {submitting ? "Placing Bid..." : "Place Bid"}
              </Button>

              <Button onClick={fetchHighestBid}>
                Refresh Highest Bid
              </Button>
            </CardActions>
          </Card>
        </form>
      )}

      {lot && (
        <Button
          variant="outlined"
          sx={{ mt: 3 }}
          onClick={() =>
            router.push(
              "/buyer/auctiondetails?id=" + lot.auction_event
            )
          }
        >
          Back to Auction Details
        </Button>
      )}
    </div>
  );
}
