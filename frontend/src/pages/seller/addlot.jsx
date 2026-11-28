
import React from "react";
import axios from "axios";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container
} from "@mui/material";

import { useRouter } from "next/router";

export default function AddLot() {
  const router = useRouter();

  const { id } = router.query;

  const addLot = async (e) => {
    e.preventDefault();

    if (!id) {
      alert("Auction ID not found");
      return;
    }

    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const title = e.target.title.value;
    const description = e.target.description.value;
    const quantity = e.target.quantity.value;
    const starting_price = e.target.starting_price.value;
    const minimum_increment = e.target.minimum_increment.value;
    const reserve_price = e.target.reserve_price.value;

    if (
      Number(quantity) <= 0 ||
      Number(starting_price) <= 0 ||
      Number(minimum_increment) <= 0
    ) {
      alert(
        "Quantity, starting price and minimum increment must be greater than zero"
      );
      return;
    }

    if (
      reserve_price &&
      Number(reserve_price) < Number(starting_price)
    ) {
      alert("Reserve price cannot be lower than the starting price");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/lots/create/",
        {
          auction_event: id,
          title: title,
          description: description,
          quantity: quantity,
          starting_price: starting_price,
          minimum_increment: minimum_increment,
          reserve_price: reserve_price || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Lot added successfully");

      router.push(`/seller/manageauction?id=${id}`);

    } catch (error) {
      console.log("Add lot error:", error.response?.data);

      alert(
        JSON.stringify(
          error.response?.data || error.message
        )
      );
    }
  };

  if (!router.isReady) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!id) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography variant="h6">
          No auction selected.
        </Typography>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => router.push("/seller/myauctions")}
        >
          My Auctions
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>

      <Button
        onClick={() =>
          router.push(`/seller/manageauction?id=${id}`)
        }
        sx={{ mb: 3 }}
      >
        Back to Manage Auction
      </Button>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>

        <CardContent sx={{ p: { xs: 3, md: 5 } }}>

          <Box sx={{ textAlign: "center", mb: 4 }}>

            <Typography variant="h4" fontWeight="bold">
              Add Auction Lot
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Enter the product details to add it to your auction.
            </Typography>

          </Box>

          <Box component="form" onSubmit={addLot}>

            <Typography fontWeight="bold" sx={{ mb: 1 }}>
              Lot Information
            </Typography>

            <TextField
              label="Lot Title"
              name="title"
              placeholder="Enter product or lot name"
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Description"
              name="description"
              placeholder="Describe the product"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              required
            />

            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              fullWidth
              margin="normal"
              required
              slotProps={{
                htmlInput: { min: 1 }
              }}
            />

            <Typography fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
              Bidding Details
            </Typography>

            <TextField
              label="Starting Price (₹)"
              name="starting_price"
              type="number"
              fullWidth
              margin="normal"
              required
              slotProps={{
                htmlInput: { min: 0.01, step: "0.01" }
              }}
            />

            <TextField
              label="Minimum Increment (₹)"
              name="minimum_increment"
              type="number"
              fullWidth
              margin="normal"
              required
              slotProps={{
                htmlInput: { min: 0.01, step: "0.01" }
              }}
            />

            <TextField
              label="Reserve Price (₹) - Optional"
              name="reserve_price"
              type="number"
              fullWidth
              margin="normal"
              slotProps={{
                htmlInput: { min: 0, step: "0.01" }
              }}
              helperText="Optional minimum price required for the item to be sold."
            />

            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "action.hover",
                borderRadius: 2
              }}
            >
              <Typography variant="body2" color="text.secondary">
                The starting price is the initial bidding amount.
                The minimum increment is the minimum amount by which
                a new bid must exceed the current highest bid.
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2
              }}
            >
              Add Lot
            </Button>

          </Box>

        </CardContent>

      </Card>

    </Container>
  );
}
