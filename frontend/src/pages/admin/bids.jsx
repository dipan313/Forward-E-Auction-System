
import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
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

export default function Bids() {
  const router = useRouter();

  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBids = () => {
    setLoading(true);
    setError("");

    axios
      .get("http://127.0.0.1:8000/bids/all/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access")
        }
      })
      .then((response) => {
        setBids(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to fetch bids");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBids();
  }, []);

  return (
    <div>
      <Typography gutterBottom variant="h4">
        All Bids
      </Typography>

      <Typography gutterBottom variant="body1">
        View and monitor all bids placed by buyers.
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bid ID</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Auction Lot</TableCell>
              <TableCell>Bid Amount</TableCell>
              <TableCell>Bid Time</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading bids...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {error}
                </TableCell>
              </TableRow>
            ) : bids.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No bids available
                </TableCell>
              </TableRow>
            ) : (
              bids.map((bid) => (
                <TableRow key={bid.id}>

                  <TableCell>{bid.id}</TableCell>

                  <TableCell>
                    {bid.bidder_name || bid.bidder}
                  </TableCell>

                  <TableCell>
                    {bid.lot_title || bid.auction_lot}
                  </TableCell>

                  <TableCell>
                    ₹{bid.bid_amount}
                  </TableCell>

                  <TableCell>
                    {new Date(bid.bid_time).toLocaleString()}
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        sx={{ mt: 3, mr: 2 }}
        onClick={fetchBids}
        disabled={loading}
      >
        Refresh Bids
      </Button>

      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={() => router.push("/admin")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
