
import React from "react";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid
} from "@mui/material";

import { useRouter } from "next/router";

export default function Seller() {
  const router = useRouter();

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                My Auctions
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => router.push("/seller/myauctions")}
              >
                View Auctions
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Create Auction
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => router.push("/seller/createauction")}
              >
                Create Auction
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Manage Auction
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => router.push("/seller/manageauction")}
              >
                Manage Auction
              </Button>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </div>
  );
}
