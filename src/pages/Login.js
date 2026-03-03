import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail , GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };
  const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    navigate("/dashboard");
  } catch (error) {
    alert(error.message);
  }
};

const handleForgotPassword = async () => {
  if (!email) {
    alert("Enter your email first");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent!");
      navigate("/", { replace: true });
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #667eea, #764ba2)",
      }}
    >
      <Paper elevation={10} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Weather App Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 3 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Typography
  mt={1}
  fontSize={13}
  color="blue"
  sx={{ cursor: "pointer" }}
  onClick={handleForgotPassword}
>
  Forgot Password?
</Typography>

        <Button variant="contained" fullWidth onClick={handleLogin}>
          Login
        </Button>
        <Button
  variant="outlined"
  fullWidth
  sx={{ mt: 2 }}
  onClick={handleGoogleLogin}
>
  Sign in with Google
</Button>
        <Typography mt={2} fontSize={14}>
  Don't have an account?{" "}
  <span
    style={{ color: "blue", cursor: "pointer" }}
    onClick={() => navigate("/signup")}
  >
    Sign Up
  </span>
</Typography>
      </Paper>
    </Box>
  );
}

export default Login;