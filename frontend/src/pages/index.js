
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Forward E-Auction
      </Typography>

      <Typography variant="body1">
        A platform to buy and sell products through online auctions.
      </Typography>
    </Box>
  );
}
