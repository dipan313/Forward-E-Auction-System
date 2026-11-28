
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

export default function Auctions() {
  const router = useRouter();

  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAuctions = () => {
    axios
      .get("http://127.0.0.1:8000/events/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access")
        }
      })
      .then((response) => {
        setAuctions(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to fetch auctions");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <div>
      <Typography gutterBottom variant="h4">
        Manage Auctions
      </Typography>

      <Typography gutterBottom variant="body1">
        View and manage all auction events.
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Auction ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Approval</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading auctions...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {error}
                </TableCell>
              </TableRow>
            ) : auctions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No auctions available
                </TableCell>
              </TableRow>
            ) : (
              auctions.map((auction) => (
                <TableRow key={auction.id}>

                  <TableCell>{auction.id}</TableCell>

                  <TableCell>{auction.title}</TableCell>

                  <TableCell>
                    {auction.seller_name || auction.seller}
                  </TableCell>

                  <TableCell>
                    {new Date(auction.start_time).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    {new Date(auction.end_time).toLocaleString()}
                  </TableCell>

                  <TableCell>{auction.status}</TableCell>

                  <TableCell>
                    <Typography
                      color={
                        auction.is_approved
                          ? "success.main"
                          : "warning.main"
                      }
                    >
                      {auction.is_approved
                        ? "Approved"
                        : "Pending"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        router.push(
                          "/admin/auctiondetails?id=" + auction.id
                        )
                      }
                    >
                      View Details
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
        onClick={() => router.push("/admin")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
