
import React from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button
} from "@mui/material";

import { useRouter } from "next/router";

export default function CreateAuction() {
  const router = useRouter();

  const create = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login first");
      return;
    }

    const title = e.target.title.value;
    const description = e.target.description.value;
    const start_time = e.target.start_time.value;
    const end_time = e.target.end_time.value;

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
    <form onSubmit={create}>

      <Card sx={{ maxWidth: 500, m: "30px auto" }}>

        <CardContent>

          <Typography variant="h5" gutterBottom>
            Create Auction
          </Typography>

          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            required
          />

          <TextField
            label="Start Time"
            name="start_time"
            type="datetime-local"
            fullWidth
            margin="normal"
            required
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />

          <TextField
            label="End Time"
            name="end_time"
            type="datetime-local"
            fullWidth
            margin="normal"
            required
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Auction
          </Button>

        </CardContent>

      </Card>

    </form>
  );
}
