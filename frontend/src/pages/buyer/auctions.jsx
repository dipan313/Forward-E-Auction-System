
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

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/events/",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access")
            }
          }
        );

        setAuctions(response.data);
      } catch (error) {
        setError("Unable to fetch auctions");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Available Auctions
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Auction ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading auctions...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {error}
                </TableCell>
              </TableRow>
            ) : auctions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No auctions available
                </TableCell>
              </TableRow>
            ) : (
              auctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>{auction.id}</TableCell>
                  <TableCell>{auction.title}</TableCell>
                  <TableCell>{auction.description}</TableCell>

                  <TableCell>
                    {new Date(auction.start_time).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    {new Date(auction.end_time).toLocaleString()}
                  </TableCell>

                  <TableCell>{auction.status}</TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        router.push(
                          "/buyer/auctiondetails?id=" + auction.id
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
    </div>
  );
}
