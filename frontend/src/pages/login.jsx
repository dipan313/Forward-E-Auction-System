
import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
  Box
} from "@mui/material";

import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BUYER");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/token/",
        {
          username: username,
          password: password
        }
      );

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "SELLER") {
        router.push("/seller");
      } else {
        router.push("/buyer");
      }

    } catch (error) {
      alert("Invalid username or password");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          <FormControl>
            <FormLabel>Select Role</FormLabel>

            <RadioGroup
              row
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel
                value="ADMIN"
                control={<Radio />}
                label="Admin"
              />

              <FormControlLabel
                value="SELLER"
                control={<Radio />}
                label="Seller"
              />

              <FormControlLabel
                value="BUYER"
                control={<Radio />}
                label="Buyer"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </CardContent>

        <CardActions sx={{ display: "block", px: 2, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
          >
            Login
          </Button>

          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => router.push("/register")}
          >
            Register Here
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
