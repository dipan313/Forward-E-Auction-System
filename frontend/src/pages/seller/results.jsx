
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from "@mui/material";

export default function SellerResults() {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const token = localStorage.getItem("access");

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
      setError("Unable to fetch your auctions.");
    }
  };

  const fetchResults = async (eventId) => {
    setSelectedAuction(eventId);
    setResults([]);
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access");

      const response = await axios.get(
        `http://127.0.0.1:8000/events/${eventId}/result/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResults(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to fetch auction results."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Auction Results
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        View the results of your auctions.
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Auction</InputLabel>

        <Select
          value={selectedAuction}
          label="Select Auction"
          onChange={(e) => fetchResults(e.target.value)}
        >
          {auctions.map((auction) => (
            <MenuItem key={auction.id} value={auction.id}>
              {auction.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && selectedAuction && !error && results.length === 0 && (
        <Alert severity="info">
          No results available for this auction.
        </Alert>
      )}

      {!loading && results.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lot ID</TableCell>
                <TableCell>Winning Bid</TableCell>
                <TableCell>Winner</TableCell>
                <TableCell>Final Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.auction_lot}</TableCell>
                  <TableCell>{result.winning_bid || "N/A"}</TableCell>
                  <TableCell>{result.winner || "N/A"}</TableCell>
                  <TableCell>
                    {result.final_price || "N/A"}
                  </TableCell>
                  <TableCell>
                    {result.is_sold ? "Sold" : "Not Sold"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
