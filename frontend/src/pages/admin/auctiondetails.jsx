
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Paper,
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
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState(false);

  const fetchAuction = () => {
    axios
      .get("http://127.0.0.1:8000/events/" + id + "/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access")
        }
      })
      .then((response) => {
        setAuction(response.data);
      })
      .catch(() => {
        setError("Unable to fetch auction details");
      });
  };

  const fetchLots = () => {
    axios
      .get("http://127.0.0.1:8000/lots/", {
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

  const approveAuction = () => {
    setApproving(true);

    axios
      .post(
        "http://127.0.0.1:8000/events/" + id + "/approve/",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
          }
        }
      )
      .then((response) => {
        alert("Auction approved successfully");

        setAuction(response.data);
        fetchLots();
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
          "Unable to approve auction"
        );
      })
      .finally(() => {
        setApproving(false);
      });
  };

  const fetchResults = () => {
    axios
      .get("http://127.0.0.1:8000/events/" + id + "/result/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access")
        }
      })
      .then((response) => {
        setResults(response.data);
        setShowResults(true);
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
          "Unable to fetch auction results"
        );
      });
  };

  return (
    <div>
      <Typography gutterBottom variant="h4">
        Auction Details
      </Typography>

      {router.isReady && !id && (
        <Typography gutterBottom>
          Please select an auction from Manage Auctions.
        </Typography>
      )}

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
              Seller: {auction.seller_name || auction.seller}
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

            <Typography
              gutterBottom
              color={
                auction.is_approved
                  ? "success.main"
                  : "warning.main"
              }
            >
              Approval Status:{" "}
              {auction.is_approved ? "Approved" : "Pending"}
            </Typography>
          </CardContent>

          <CardActions>
            <Button
              variant="contained"
              onClick={approveAuction}
              disabled={
                auction.is_approved ||
                approving ||
                new Date(auction.end_time) <= new Date()
              }
            >
              {auction.is_approved
                ? "Already Approved"
                : "Approve Auction"}
            </Button>

            {auction.status === "CLOSED" && (
              <Button
                variant="contained"
                onClick={fetchResults}
              >
                View Results
              </Button>
            )}
          </CardActions>
        </Card>
      )}

      <Typography gutterBottom variant="h5">
        Auction Lots
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
              <TableCell>Minimum Increment</TableCell>
              <TableCell>Reserve Price</TableCell>
              <TableCell>Published</TableCell>
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
                  ₹{lot.minimum_increment}
                </TableCell>

                <TableCell>
                  {lot.reserve_price != null
                    ? "₹" + lot.reserve_price
                    : "Not Set"}
                </TableCell>

                <TableCell>
                  {lot.is_published ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))}

            {lots.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {error
                    ? "Lot information unavailable"
                    : "No lots to display"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showResults && (
        <div>
          <Typography
            gutterBottom
            variant="h5"
            sx={{ mt: 3 }}
          >
            Auction Results
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Lot</TableCell>
                  <TableCell>Winner</TableCell>
                  <TableCell>Final Price</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      {result.lot_title || result.auction_lot}
                    </TableCell>

                    <TableCell>
                      {result.winner_name ||
                        result.winner ||
                        "No Winner"}
                    </TableCell>

                    <TableCell>
                      {result.final_price != null
                        ? "₹" + result.final_price
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {result.is_sold ? "Sold" : "Not Sold"}
                    </TableCell>
                  </TableRow>
                ))}

                {results.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No results available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={() => router.push("/admin/auctions")}
      >
        Back to Auctions
      </Button>
    </div>
  );
}
