import React, { useState, useEffect, useNavigate } from "react";
import { Button, TextField } from "@mui/material";
import http from "axios";

const CreateEvent = ({ teamname }) => {
  const [event, setEvent] = useState({
    title: "",
    location: "",
    dateFrom: "",
    dateTo: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  const handleChange = (e) => {
    setEvent((prevText) => {
      return { ...prevText, [e.target.name]: e.target.value };
    });
  };

  const addEvent = async () => {
    try {
      const response = await http.post(
        `http://localhost:4000/api/dashboard/event/add?teamname=${teamname}`,
        {
          title: event.title,
          location: event.location,
          dateFrom: event.dateFrom,
          dateTo: event.dateTo,
        },
        { headers: { authorization: token } }
      );
      return navigate("/dashboard");
    } catch (err) {
      console.log(err);
      if (!err.response) setErrorMsg("Server error");
    }
  };
  //
  return (
    <div>
      <div className="dashboardContainer flex-container">
        <h2>Create new Event</h2>
        <TextField
          type="text"
          label="Title"
          name="title"
          value={event.title}
          onChange={handleChange}
        />
        <TextField
          type="text"
          label="Location"
          name="location"
          value={event.location}
          onChange={handleChange}
        />
        <TextField
          type="date"
          label="From"
          name="dateFrom"
          value={event.dateFrom}
          onChange={handleChange}
        />
        <TextField
          type="date"
          label="To:"
          name="dateTo"
          value={event.dateTo}
          onChange={handleChange}
        />
        <Button variant="contained" onClick={() => addEvent()}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateEvent;
