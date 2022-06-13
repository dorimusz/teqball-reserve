import { React, useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./routes/Home";
import NavBar from "./components/NavBar";
import Register from "./routes/Register";
import Login from "./routes/Login";
import CreateEvent from "./routes/CreateEvent";
import CreateTeam from "./routes/CreateTeam";
import Dashboard from "./routes/Dashboard";
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    sessionStorage.getItem("token") && setLoggedIn(true);
  }, [])

  return (
    <div className="App">
      <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route path="/" element={<Home setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/create-event" element={<CreateEvent />} />
      </Routes>
    </div>
  );
}

export default App;

/*
import logger from "./utils/logflare";
logger.info("logging to logflare");
*/
