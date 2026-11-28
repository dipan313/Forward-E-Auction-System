
import React, { useState, useEffect } from "react";

import {
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from "@mui/material";

import axios from "axios";
import { useRouter } from "next/router";

export default function AuctionDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [auction, setAuction] = useState(null);
  const [lots, setLots] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady || !id) return;

    const headers = {
      Authorization: "Bearer " + localStorage.getItem("access")
    };

    const fetchData = async () => {
      try {
        const auctionResponse = await axios.get(
          "http://127.0.0.1:8000/events/",
          { headers }
        );

        const selectedAuction = auctionResponse.data.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedAuction) {
          setError("Auction not found");
          return;
        }

        setAuction(selectedAuction);

        const lotResponse = await axios.get(
          "http://127.0.0.1:8000/lots/",
          { headers }
        );

        const selectedLots = lotResponse.data.filter((lot) => {
          const eventId =
            typeof lot.auction_event === "object"
              ? lot.auction_event.id
              : lot.auction_event;

          return String(eventId) === String(id);
        });

        setLots(selectedLots);
      } catch (error) {
        setError("Unable to fetch auction details");
      }
    };

    fetchData();
  }, [router.isReady, id]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Auction Details
      </Typography>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {auction && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {auction.title}
            </Typography>

            <Typography gutterBottom>
              Auction ID: {auction.id}
            </Typography>

            <Typography gutterBottom>
              Description: {auction.description}
            </Typography>

            <Typography gutterBottom>
              Start Time: {new Date(auction.start_time).toLocaleString()}
            </Typography>

            <Typography gutterBottom>
              End Time: {new Date(auction.end_time).toLocaleString()}
            </Typography>

            <Typography gutterBottom>
              Status: {auction.status}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Typography variant="h5" gutterBottom>
        Available Lots
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lot ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Starting Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {lots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No lots to display
                </TableCell>
              </TableRow>
            ) : (
              lots.map((lot) => (
                <TableRow key={lot.id}>
                  <TableCell>{lot.id}</TableCell>
                  <TableCell>{lot.title}</TableCell>
                  <TableCell>{lot.description}</TableCell>
                  <TableCell>{lot.quantity}</TableCell>
                  <TableCell>₹{lot.starting_price}</TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        router.push("/buyer/lotdetails?id=" + lot.id)
                      }
                    >
                      View Lot
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={() => router.push("/buyer/auctions")}
      >
        Back to Auctions
      </Button>
    </div>
  );
}
