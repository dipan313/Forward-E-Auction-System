
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Chip,
  Divider
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

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "LIVE":
        return "success";
      case "CLOSED":
        return "default";
      case "SCHEDULED":
        return "info";
      case "DRAFT":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography color="text.secondary">
          Loading auction details...
        </Typography>
      </Container>
    );
  }

  if (!id) {
    return (
      <Container sx={{ py: 5 }}>
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>

          <Typography variant="h5" fontWeight="bold">
            No Auction Selected
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Please select an auction from your auction list.
          </Typography>

          <Button
            variant="contained"
            onClick={() => router.push("/seller/myauctions")}
          >
            My Auctions
          </Button>

        </Card>
      </Container>
    );
  }

  if (!auction) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography variant="h6">
          Auction not found.
        </Typography>

        <Button
          sx={{ mt: 2 }}
          onClick={() => router.push("/seller/myauctions")}
        >
          Back to My Auctions
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>

      <Button
        onClick={() => router.push("/seller/myauctions")}
        sx={{ mb: 3 }}
      >
        Back to My Auctions
      </Button>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>

        <CardContent sx={{ p: { xs: 3, md: 4 } }}>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 3
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {auction.title}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Manage your auction and its lots.
              </Typography>
            </Box>

            <Chip
              label={auction.status}
              color={getStatusColor(auction.status)}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Auction Information
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {auction.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography fontWeight="medium">
              Start Time
            </Typography>

            <Typography color="text.secondary">
              {formatDate(auction.start_time)}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography fontWeight="medium">
              End Time
            </Typography>

            <Typography color="text.secondary">
              {formatDate(auction.end_time)}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Approval Status
          </Typography>

          <Chip
            label={
              auction.is_approved
                ? "Approved by Admin"
                : "Awaiting Admin Approval"
            }
            color={auction.is_approved ? "success" : "warning"}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              bgcolor: "action.hover",
              p: 3,
              borderRadius: 2
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Manage Auction Lots
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              Add products or items to this auction for buyers to bid on.
            </Typography>

            <Button
              variant="contained"
              onClick={() =>
                router.push(`/seller/addlot?id=${id}`)
              }
            >
              Add Auction Lot
            </Button>
          </Box>

        </CardContent>

      </Card>

    </Container>
  );
}
