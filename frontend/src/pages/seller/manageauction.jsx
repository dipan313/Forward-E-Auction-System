
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  Typography,
  Button
} from "@mui/material";

import { useRouter } from "next/router";

export default function ManageAuction() {
  const router = useRouter();

  const { id } = router.query;

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!id) {
      setLoading(false);
      return;
    }

    getAuction();
  }, [router.isReady, id]);

  const getAuction = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/events/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
          }
        }
      );

      setAuction(response.data);

    } catch (error) {
      console.log("Auction loading error:", error.response?.data);

      alert(
        JSON.stringify(
          error.response?.data || error.message
        )
      );

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography sx={{ p: 3 }}>
        Loading auction...
      </Typography>
    );
  }

  if (!id) {
    return (
      <div style={{ padding: "30px" }}>
        <Typography variant="h5">
          Please select an auction from My Auctions.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => router.push("/seller/myauctions")}
        >
          My Auctions
        </Button>
      </div>
    );
  }

  if (!auction) {
    return (
      <Typography sx={{ p: 3 }}>
        Auction not found.
      </Typography>
    );
  }

  return (
    <div style={{ padding: "30px" }}>

      <Card sx={{ maxWidth: 600 }}>

        <CardContent>

          <Typography variant="h5" gutterBottom>
            Manage Auction
          </Typography>

          <Typography>
            Title: {auction.title}
          </Typography>

          <Typography>
            Description: {auction.description}
          </Typography>

          <Typography>
            Start Time: {auction.start_time}
          </Typography>

          <Typography>
            End Time: {auction.end_time}
          </Typography>

          <Typography>
            Status: {auction.status}
          </Typography>

          <Typography>
            Approved: {auction.is_approved ? "Yes" : "No"}
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() =>
              router.push(`/seller/addlot?id=${id}`)
            }
          >
            Add Lot
          </Button>

        </CardContent>

      </Card>

    </div>
  );
}
