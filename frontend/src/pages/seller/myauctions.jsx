
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  Typography,
  Button
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

  return (
    <div style={{ padding: "30px" }}>

      <Typography variant="h4" gutterBottom>
        My Auctions
      </Typography>

      <Button
        variant="contained"
        onClick={() => router.push("/seller/createauction")}
        sx={{ mb: 3 }}
      >
        Create Auction
      </Button>

      {loading ? (
        <Typography>Loading auctions...</Typography>
      ) : (
        auctions.map((auction) => (
          <Card key={auction.id} sx={{ mb: 2 }}>
            <CardContent>

              <Typography variant="h6">
                {auction.title}
              </Typography>

              <Typography>
                {auction.description}
              </Typography>

              <Typography>
                Status: {auction.status}
              </Typography>

              <Typography>
                Start Time: {auction.start_time}
              </Typography>

              <Typography>
                End Time: {auction.end_time}
              </Typography>

              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() =>
                  router.push(
                    `/seller/manageauction?id=${auction.id}`
                  )
                }
              >
                Manage
              </Button>

            </CardContent>
          </Card>
        ))
      )}

    </div>
  );
}
