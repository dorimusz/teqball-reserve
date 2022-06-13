import { React, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import http from "axios";
import logger from '../utils/logflare';
import { Button, TextField } from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailWarning, setEmailWarning] = useState(false);
  const [usernameWarning, setUsernameWarning] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const navigate = useNavigate();

  const checkEmail = async () => {
    if (email.length <= 3 || !email.includes("@")) return setDisableButton(true);
    setDisableButton(false);
    try {
      const result = await http.post("http://localhost:4000/api/signup/check_email", {
        email: email
      });
      if (result.status === 200) {
        setEmailWarning(false);
        setDisableButton(false);
        return;
      };
    } catch (err) {
      if (err.response.status === 409) {
        setEmailWarning(true);
        setDisableButton(true);
        return;
      };
      console.log(err.response);
    };
  };

  const checkUsername = async () => {
    if (username.length <= 2) return setDisableButton(true);
    setDisableButton(false);
    try {
      const result = await http.post("http://localhost:4000/api/signup/check_username", {
        username: username
      });
      if (result.status === 200) {
        setUsernameWarning(false);
        setDisableButton(false);
        return;
      };
    } catch (err) {
      if (err.response.status === 409) {
        setUsernameWarning(true);
        setDisableButton(true);
        return;
      };
      console.log(err.response);
    }
  };

  const register = async () => {
    try {
      const response = await http.post("http://localhost:4000/api/signup", {
        username: username,
        email: email,
        password: password
      });
      if (response.status === 200) {
        logger.info(response.data, "is registered.");
        return navigate("/login");
      }
    } catch (err) {
      if (err.response.status === 400) return console.log("All fields are required!");
      console.log(err.response);
    };
  };

  useEffect(() => {
    checkEmail();
    // eslint-disable-next-line
  }, [email])

  useEffect(() => {
    checkUsername();
    // eslint-disable-next-line
  }, [username])


  return (
    <div className="regContainer regComponent">
      <h2 className='h2title'>Register</h2>
      <TextField onChange={(e) => setEmail(e.target.value)} value={email} required variant="outlined" size="medium" label="Email" error={emailWarning} helperText={emailWarning && "Email is already registered"} />
      <TextField onChange={(e) => setUsername(e.target.value)} value={username} required variant="outlined" size="medium" label="Username" error={usernameWarning} helperText={usernameWarning && "Username is already registered"} />
      <TextField onChange={(e) => setPassword(e.target.value)} value={password} required type="password" variant="outlined" size="medium" label="Password" />
      <Button onClick={() => register()} disabled={disableButton} variant="contained" color="success" size="medium">Register</Button>
    </div>
  )
}

export default Register

/*
useeffectben az osszes onchange-re figyelendo state valtozo
//
useEffect(() => {
    checkInput();
  }, [username, email]);
//
register()-ben legyen ures input ellenorzes is
*/
