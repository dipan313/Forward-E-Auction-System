
import React from "react";
import {
  Typography,
  Grid,
  Paper,
  Button
} from "@mui/material";

import { useRouter } from "next/router";

export default function Admin() {
  const router = useRouter();

  return (
    <div style={{ padding: "30px" }}>

      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Typography variant="body1" gutterBottom>
        Welcome to the Forward E-Auction System
      </Typography>

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>

            <Typography variant="h5" gutterBottom>
              Manage Auctions
            </Typography>

            <Typography variant="body1" gutterBottom>
              View auction events, check auction details
              and approve auctions created by sellers.
            </Typography>

            <Button
              variant="contained"
              onClick={() => router.push("/admin/auctions")}
            >
              Manage Auctions
            </Button>

          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>

            <Typography variant="h5" gutterBottom>
              All Bids
            </Typography>

            <Typography variant="body1" gutterBottom>
              View and monitor all bids placed by buyers
              in auction events.
            </Typography>

            <Button
              variant="contained"
              onClick={() => router.push("/admin/bids")}
            >
              View All Bids
            </Button>

          </Paper>
        </Grid>

      </Grid>

    </div>
  );
}
