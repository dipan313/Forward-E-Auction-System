
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

import { useRouter } from "next/router";

export default function BuyerLayout({ children }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    router.push("/login");
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Buyer Dashboard
          </Typography>

          <Button color="inherit" onClick={() => router.push("/buyer")}>
            Dashboard
          </Button>

          <Button color="inherit" onClick={() => router.push("/buyer/auctions")}>
            Auctions
          </Button>

          <Button color="inherit" onClick={() => router.push("/buyer/mybids")}>
            My Bids
          </Button>

          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ minHeight: "75vh", p: 3 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "#1976d2",
          color: "white",
          textAlign: "center",
          p: 2,
        }}
      >
        <Typography variant="body2">
          © 2026 Forward E-Auction. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}
