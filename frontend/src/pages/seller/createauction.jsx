
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

export default function CreateAuction() {
  const router = useRouter();

  const create = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const title = e.target.title.value;
    const description = e.target.description.value;
    const start_time = e.target.start_time.value;
    const end_time = e.target.end_time.value;

    if (new Date(end_time) <= new Date(start_time)) {
      alert("End time must be after start time");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/events/create/",
        {
          title: title,
          description: description,
          start_time: start_time,
          end_time: end_time
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Auction created successfully");

      console.log("Created auction:", response.data);

      router.push("/seller/myauctions");

    } catch (error) {
      console.log("Auction creation error:", error.response?.data);

      alert(
        JSON.stringify(
          error.response?.data || error.message
        )
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>

      <Button
        onClick={() => router.push("/seller")}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3
        }}
      >

        <CardContent sx={{ p: { xs: 3, md: 5 } }}>

          <Box sx={{ textAlign: "center", mb: 4 }}>

            <Typography variant="h4" fontWeight="bold">
              Create New Auction
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Enter the auction details to create your auction event.
            </Typography>

          </Box>

          <Box component="form" onSubmit={create}>

            <Typography fontWeight="bold" sx={{ mb: 1 }}>
              Auction Title
            </Typography>

            <TextField
              name="title"
              placeholder="Enter auction title"
              fullWidth
              required
              margin="normal"
            />

            <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
              Description
            </Typography>

            <TextField
              name="description"
              placeholder="Describe your auction"
              fullWidth
              multiline
              rows={4}
              required
              margin="normal"
            />

            <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
              Auction Schedule
            </Typography>

            <TextField
              label="Start Time"
              name="start_time"
              type="datetime-local"
              fullWidth
              required
              margin="normal"
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />

            <TextField
              label="End Time"
              name="end_time"
              type="datetime-local"
              fullWidth
              required
              margin="normal"
              slotProps={{
                inputLabel: { shrink: true }
              }}
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
                Note: Your auction will be submitted for admin approval.
                You can add auction lots from the Manage Auction page.
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
              Create Auction
            </Button>

          </Box>

        </CardContent>

      </Card>

    </Container>
  );
}
