import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [errorMSG, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  const createTeam = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/team/add",
        {
          name: teamName,
        },
        { headers: { authorization: token } }
      );
      return navigate('/dashboard')
    } catch (err) {
      console.log(err);
      if (!err.response) setErrorMsg("Server error");
    }
  };
  //
  return (
    <div>
      <div className="regContainer flex-container">
        <h2 className="h2title">CreateTeam</h2>
        <p>By adding a name and hittin' the button you'll create a new team. </p>
        <TextField
          type="text"
          label="Name of the team"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <Button variant="contained" onClick={() => createTeam()}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateTeam;
