import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import http from "axios";
// import logger from '../utils/logflare';
import { Button, TextField } from "@mui/material";

const Login = ({ setLoggedIn }) => {
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await http.post("http://localhost:4000/api/login", {
        credentials: credentials,
        password: password,
      });
      console.log(response, "is logged in.");
      sessionStorage.setItem("token", response.data);
      setLoggedIn(true);
      return navigate("/dashboard");
    } catch (err) {
      if (!err.response) return alert("network error");
      if (err.response.status === 400) {
        return alert("Missing field(s).");
      } else if (err.response.status === 401) {
        setCredentials("");
        setPassword("");
        return alert("Nice try...");
      }
      return alert("Something went wrong.");
    }
  };

  return (
    <div className="loginContainer loginComponent">
      <h2 className="h2title">Login</h2>
      <TextField
        label="Email or Username"
        onChange={(e) => setCredentials(e.target.value)}
        value={credentials}
        required
        variant="outlined"
        size="medium"
      />
      <TextField
        label="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
        type="password"
        variant="outlined"
        size="medium"
      />
      <Button onClick={() => login()} variant="contained" color="success" size="medium">
        Login
      </Button>
    </div>
  );
};

export default Login;

/*

*/
