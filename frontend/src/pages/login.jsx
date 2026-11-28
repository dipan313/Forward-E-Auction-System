
import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  TextField,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button
} from "@mui/material";

import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const log = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const role = e.target.role.value;

    if (!role) {
      alert("Please select a role");
      return;
    }

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
      localStorage.setItem("role", role);

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "SELLER") {
        router.push("/seller");
      } else if (role === "BUYER") {
        router.push("/buyer");
      }

    } catch (error) {
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <form onSubmit={log}>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Forward E-Auction Login
          </Typography>

          <FormControl>
            <FormLabel>Login As</FormLabel>

            <RadioGroup row name="role">
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
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
          />
        </CardContent>

        <CardActions>
          <Button type="submit">Login</Button>

          <Button onClick={() => router.push("/register")}>
            Register Here
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
