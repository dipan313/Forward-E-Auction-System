
import React from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Container
} from "@mui/material";

import { useRouter } from "next/router";

export default function Seller() {
  const router = useRouter();

  const dashboardItems = [
    {
      title: "My Auctions",
      description:
        "View all your created auctions and check their current status.",
      button: "View Auctions",
      path: "/seller/myauctions"
    },
    {
      title: "Create Auction",
      description:
        "Create a new auction event and add products for bidding.",
      button: "Create Auction",
      path: "/seller/createauction"
    },
    {
      title: "Manage Auction",
      description:
        "Manage an existing auction and add auction lots.",
      button: "Manage Auction",
      path: "/seller/myauctions"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>

      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Seller Dashboard
        </Typography>

        <Typography color="text.secondary">
          Welcome to your seller workspace. Create auctions, manage your
          listings and keep track of your auction activities.
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        justifyContent="center"
      >

        {dashboardItems.map((item) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={item.title}
            sx={{
              maxWidth: { md: "300px" },
              flexBasis: { md: "300px" }
            }}
          >

            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: 2,
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 5
                }
              }}
            >

              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  boxSizing: "border-box"
                }}
              >

                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                >
                  {item.title}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ flexGrow: 1, mb: 3 }}
                >
                  {item.description}
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => router.push(item.path)}
                >
                  {item.button}
                </Button>

              </CardContent>

            </Card>

          </Grid>
        ))}

      </Grid>

      <Box
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 3,
          bgcolor: "action.hover",
          maxWidth: 950,
          mx: "auto"
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Getting Started
        </Typography>

        <Typography color="text.secondary">
          Create an auction first. Once created, open My Auctions to
          manage it and add auction lots. Your auction will be available
          to buyers after admin approval.
        </Typography>
      </Box>

    </Container>
  );
}
