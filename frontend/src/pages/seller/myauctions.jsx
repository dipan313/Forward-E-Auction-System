
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Chip,
  Grid
} from "@mui/material";

import { useRouter } from "next/router";

export default function MyAuctions() {
  const router = useRouter();

  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuctions();
  }, []);

  const getAuctions = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login first");
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/events/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAuctions(response.data);

    } catch (error) {
      console.log("Auction loading error:", error.response?.data);

      alert(
        JSON.stringify(
          error.response?.data || error.message
        )
      );

    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "LIVE":
        return "success";
      case "CLOSED":
        return "default";
      case "SCHEDULED":
        return "info";
      case "DRAFT":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            My Auctions
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            View and manage all your created auctions.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => router.push("/seller/createauction")}
        >
          Create Auction
        </Button>
      </Box>

      {loading ? (

        <Typography color="text.secondary">
          Loading your auctions...
        </Typography>

      ) : auctions.length === 0 ? (

        <Card
          sx={{
            textAlign: "center",
            p: 5,
            borderRadius: 3,
            maxWidth: 650,
            mx: "auto"
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            No Auctions Found
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            You haven't created any auctions yet. Create your first auction
            to get started.
          </Typography>

          <Button
            variant="contained"
            onClick={() => router.push("/seller/createauction")}
          >
            Create Your First Auction
          </Button>
        </Card>

      ) : (

        <Grid
          container
          spacing={3}
          justifyContent="center"
        >

          {auctions.map((auction) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={auction.id}
              sx={{
                maxWidth: { md: "320px" },
                flexBasis: { md: "320px" }
              }}
            >

              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: "0.2s",
                  "&:hover": {
                    boxShadow: 5,
                    transform: "translateY(-3px)"
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

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                      mb: 2
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {auction.title}
                    </Typography>

                    <Chip
                      label={auction.status}
                      color={getStatusColor(auction.status)}
                      size="small"
                    />
                  </Box>

                  <Typography
                    color="text.secondary"
                    sx={{ mb: 3, flexGrow: 1 }}
                  >
                    {auction.description}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Starts: {formatDate(auction.start_time)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Ends: {formatDate(auction.end_time)}
                  </Typography>

                  <Chip
                    label={
                      auction.is_approved
                        ? "Approved"
                        : "Awaiting Approval"
                    }
                    color={auction.is_approved ? "success" : "warning"}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, alignSelf: "flex-start" }}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() =>
                      router.push(
                        `/seller/manageauction?id=${auction.id}`
                      )
                    }
                  >
                    Manage Auction
                  </Button>

                </CardContent>

              </Card>

            </Grid>
          ))}

        </Grid>
      )}

    </Container>
  );
}
