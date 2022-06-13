import { React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const NavBar = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("token");
    setLoggedIn(false);
    // window.location.reload();
    navigate("./");
  };

  return (
    <div className="navbar">
      {!loggedIn ?
        (<Link to="/">
          <Button variant="contained" color="secondary" size="medium">HOME</Button>
        </Link>) :
        (<Link to="/dashboard">
          <Button variant="contained" color="secondary" size="medium">DASHBOARD</Button>
        </Link>)}
      {/* <Link to="/">
        <Button variant="contained" color="secondary" size="medium">HOME</Button>
      </Link> */}

      {!loggedIn &&
        <Link to="/register">
          <Button variant="contained" color="primary" size="medium">Register</Button>
        </Link>}

      {!loggedIn &&
        <Link to="/login">
          <Button variant="contained" color="primary" size="medium">Log in</Button>
        </Link>}

      {loggedIn &&
        <Button onClick={() => logout()} variant="contained" color="warning" size="medium">
          Log out
        </Button>}
    </div>
  )
}

export default NavBar
