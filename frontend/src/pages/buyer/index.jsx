
import React from "react";

import {
  Typography,
  Grid,
  Paper,
  Button
} from "@mui/material";

import { useRouter } from "next/router";

export default function Buyer() {
  const router = useRouter();

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" gutterBottom>
        Buyer Dashboard
      </Typography>

      <Typography variant="body1" gutterBottom>
        Welcome to the Forward E-Auction System
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Available Auctions
            </Typography>

            <Typography variant="body1" gutterBottom>
              View available auctions and participate in bidding.
            </Typography>

            <Button
              variant="contained"
              onClick={() => router.push("/buyer/auctions")}
            >
              View Auctions
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              My Bids
            </Typography>

            <Typography variant="body1" gutterBottom>
              View your placed bids and bidding status.
            </Typography>

            <Button
              variant="contained"
              onClick={() => router.push("/buyer/mybids")}
            >
              View My Bids
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
