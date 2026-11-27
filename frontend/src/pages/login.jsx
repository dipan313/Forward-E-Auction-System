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
import React from "react";

export default function Login() {

  const router = useRouter();

  const log = (e) => {

    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const role = e.target.role.value;

    if (!role) {
      alert("Please select a role");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/token/", {
        username: username,
        password: password
      })

      .then((response) => {

        const actualRole = response.data.is_staff
          ? "ADMIN"
          : response.data.role;

        if (actualRole !== role) {
          alert("Please select the correct role");
          return;
        }

        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("role", actualRole);

        if (actualRole === "ADMIN") {
          router.push("/admin");
        }

        else if (actualRole === "SELLER") {
          router.push("/seller");
        }

        else if (actualRole === "BUYER") {
          router.push("/buyer");
        }

      })

      .catch((error) => {
        console.log(error);
        alert(error.response?.data?.detail || "Login failed");
      });
  };

  return (

    <div>

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
              id="username"
              label="Username"
              variant="outlined"
              name="username"
              fullWidth
              margin="normal"
              required
            />

            <TextField
              id="password"
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              required
            />

          </CardContent>

          <CardActions>

            <Button size="small" type="submit">
              Submit
            </Button>

            <Button
              size="small"
              onClick={() => router.push("/register")}
            >
              Register Here
            </Button>

          </CardActions>

        </Card>

      </form>

    </div>
  );
}