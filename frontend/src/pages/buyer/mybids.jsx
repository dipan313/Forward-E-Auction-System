
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

export default function MyBids() {
  const router = useRouter();

  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/bids/my/",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access")
            }
          }
        );

        setBids(response.data);
      } catch (error) {
        setError("Unable to fetch your bids");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Bids
      </Typography>

      <Typography variant="body1" gutterBottom>
        View your previously placed bids.
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bid ID</TableCell>
              <TableCell>Auction Lot ID</TableCell>
              <TableCell>Bid Amount</TableCell>
              <TableCell>Bid Time</TableCell>
              <TableCell>Action</TableCell>
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
                  You have not placed any bids yet
                </TableCell>
              </TableRow>
            ) : (
              bids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell>{bid.id}</TableCell>
                  <TableCell>{bid.auction_lot}</TableCell>
                  <TableCell>₹{bid.bid_amount}</TableCell>

                  <TableCell>
                    {new Date(bid.bid_time).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        router.push(
                          "/buyer/lotdetails?id=" + bid.auction_lot
                        )
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
        onClick={() => router.push("/buyer")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
