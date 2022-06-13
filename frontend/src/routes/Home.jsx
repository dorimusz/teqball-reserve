import { React, useState, useEffect } from "react";
import http from "axios";
import { Button } from "@mui/material";
import Register from "../routes/Register";
import Login from "../routes/Login";

const Home = ({ loggedIn, setLoggedIn }) => {
  const [showPrivate, setShowPrivate] = useState("");
  const [privateAccess, setPrivateAccess] = useState(false);

  const getPrivate = async () => {
    try {
      const response = await http.get("http://localhost:4000/api/private", {
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
      });
      return setShowPrivate(response.data);
    } catch (err) {
      if (!err.response) return alert("network error");
      if (err.response.status === 401) return alert("Unauthorized");
      return alert("something went wrong");
    }
  };

  useEffect(() => {
    sessionStorage.getItem("token") && setPrivateAccess(true);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="homeComponent flex-container">
      <h1>Welcome dear teqball player!</h1>
      <p>
        Register a new account or log in to an existing one to form and join
        groups and events.
      </p>
      <div className="formsContainer">
        <Register />
        <Login setLoggedIn={setLoggedIn} />
      </div>
      {/* {privateAccess &&
        <Button
          onClick={() => getPrivate()}
          variant="outlined" color="primary" size="medium">
          Private request
        </Button>}
      <p>{showPrivate}</p> */}
    </div>
  );
};

export default Home;

/*
const [showPublic, setShowPublic] = useState("");

const getPublic = async() => {
    try {
      const response = await http.get("http://localhost:4000/api/public");
      return setShowPublic(response.data);
    } catch (err) {
      if (!err.response) return alert("network error");
      if (err.response.status === 404) return alert ("requested resource not found");
      return alert("something went wrong");
    };
  };

*/
