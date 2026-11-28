
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("BUYER");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/register/",
        {
          username,
          password,
          mobile,
          role,
        }
      );

      alert("Registration successful!");
      router.push("/login");

    } catch (error) {
      console.log(error.response?.data);
      alert("Registration failed. Please check your details.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            label="Mobile Number"
            margin="normal"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormControl sx={{ mt: 2 }}>
            <FormLabel>Select Role</FormLabel>

            <RadioGroup
              row
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel
                value="BUYER"
                control={<Radio />}
                label="Buyer"
              />

              <FormControlLabel
                value="SELLER"
                control={<Radio />}
                label="Seller"
              />
            </RadioGroup>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleRegister}
          >
            Register
          </Button>

          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => router.push("/login")}
          >
            Already have an account? Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
