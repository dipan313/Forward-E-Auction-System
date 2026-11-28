
import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper
} from "@mui/material";

import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ padding: "30px" }}>

      <Paper
        elevation={3}
        sx={{
          p: 5,
          mb: 4,
          textAlign: "center",
          backgroundColor: "#edf5fc"
        }}
      >
        <Typography variant="h3" gutterBottom color="primary">
          Welcome to Forward E-Auction System
        </Typography>

        <Typography variant="body1" gutterBottom>
          An online platform where sellers create auctions,
          buyers participate in bidding and administrators
          manage auction activities.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2, mr: 2 }}
          onClick={() => router.push("/login")}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => router.push("/register")}
        >
          Register
        </Button>
      </Paper>

      <Typography variant="h4" gutterBottom align="center">
        Our Services
      </Typography>

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Buyer
              </Typography>

              <Typography variant="body1">
                View available auctions, participate in bidding
                and check your bid history.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Seller
              </Typography>

              <Typography variant="body1">
                Create auction events, add auction lots
                and view auction results.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Admin
              </Typography>

              <Typography variant="body1">
                Manage auction events, approve auctions
                and monitor all bidding activities.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </div>
  );
}
