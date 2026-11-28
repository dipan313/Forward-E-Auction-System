
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid
} from "@mui/material";

import { useRouter } from "next/router";

export default function Buyer() {
  const router = useRouter();

  return (
    <div>
      <Typography gutterBottom variant="h4">
        Buyer Dashboard
      </Typography>

      <Typography gutterBottom variant="body1">
        Welcome to the Forward E-Auction System
      </Typography>

      <Grid container spacing={3}>

        <Card sx={{ maxWidth: 400 }}>
          <CardContent>
            <Typography gutterBottom variant="h5">
              Available Auctions
            </Typography>

            <Typography variant="body2">
              View available auctions and participate in bidding.
            </Typography>
          </CardContent>

          <CardActions>
            <Button onClick={() => router.push("/buyer/auctions")}>
              View Auctions
            </Button>
          </CardActions>
        </Card>

        <Card sx={{ maxWidth: 400 }}>
          <CardContent>
            <Typography gutterBottom variant="h5">
              My Bids
            </Typography>

            <Typography variant="body2">
              View your placed bids and bidding status.
            </Typography>
          </CardContent>

          <CardActions>
            <Button onClick={() => router.push("/buyer/mybids")}>
              View My Bids
            </Button>
          </CardActions>
        </Card>

      </Grid>
    </div>
  );
}
