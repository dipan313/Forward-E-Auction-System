
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

import { useRouter } from "next/router";

export default function GeneralLayout({ children }) {
  const router = useRouter();

  return (
    <>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Forward E-Auction
          </Typography>

          <Button color="inherit" onClick={() => router.push("/home")}>
            Home
          </Button>

          <Button color="inherit" onClick={() => router.push("/login")}>
            Login
          </Button>

          <Button color="inherit" onClick={() => router.push("/register")}>
            Register
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
