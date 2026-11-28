
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

  const fetchAuction = () => {
    axios
      .get("http://127.0.0.1:8000/auctionevent/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access")
        }
      })
      .then((response) => {
        const selectedAuction = response.data.find(
          (auction) => String(auction.id) === String(id)
        );

        if (selectedAuction) {
          setAuction(selectedAuction);
        } else {
          setError("Auction not found");
        }
      })
      .catch(() => {
        setError("Unable to fetch auction details");
      });
  };

  const fetchLots = () => {
    axios
      .get("http://127.0.0.1:8000/auctionlot/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access")
        }
      })
      .then((response) => {
        const selectedLots = response.data.filter(
          (lot) => String(lot.auction_event) === String(id)
        );

        setLots(selectedLots);
      })
      .catch(() => {
        setError("Unable to fetch auction lots");
      });
  };

  useEffect(() => {
    if (router.isReady && id) {
      fetchAuction();
      fetchLots();
    }
  }, [router.isReady, id]);

  return (
    <div>
      <Typography gutterBottom variant="h4">
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
            <Typography gutterBottom variant="h5">
              {auction.title}
            </Typography>

            <Typography gutterBottom>
              Auction ID: {auction.id}
            </Typography>

            <Typography gutterBottom>
              Description: {auction.description}
            </Typography>

            <Typography gutterBottom>
              Start Time:{" "}
              {new Date(auction.start_time).toLocaleString()}
            </Typography>

            <Typography gutterBottom>
              End Time:{" "}
              {new Date(auction.end_time).toLocaleString()}
            </Typography>

            <Typography gutterBottom>
              Status: {auction.status}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Typography gutterBottom variant="h5">
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
            {lots.map((lot) => (
              <TableRow key={lot.id}>
                <TableCell>{lot.id}</TableCell>

                <TableCell>{lot.title}</TableCell>

                <TableCell>{lot.description}</TableCell>

                <TableCell>{lot.quantity}</TableCell>

                <TableCell>
                  ₹{lot.starting_price}
                </TableCell>

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
            ))}

            {lots.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No lots to display
                </TableCell>
              </TableRow>
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
