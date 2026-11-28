
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

export default function AddLot() {
  const router = useRouter();

  const { id } = router.query;

  const addLot = async (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;
    const quantity = e.target.quantity.value;
    const starting_price = e.target.starting_price.value;
    const minimum_increment = e.target.minimum_increment.value;
    const reserve_price = e.target.reserve_price.value;

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
            Authorization: `Bearer ${localStorage.getItem("access")}`
          }
        }
      );

      alert("Lot added successfully");
      router.push(`/seller/manageauction?id=${id}`);

    } catch (error) {
      alert("Unable to add lot");
    }
  };

  return (
    <form onSubmit={addLot}>
      <Card sx={{ maxWidth: 500, m: "30px auto" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Add Auction Lot
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
            label="Quantity"
            name="quantity"
            type="number"
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Starting Price"
            name="starting_price"
            type="number"
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Minimum Increment"
            name="minimum_increment"
            type="number"
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Reserve Price"
            name="reserve_price"
            type="number"
            fullWidth
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Lot
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
