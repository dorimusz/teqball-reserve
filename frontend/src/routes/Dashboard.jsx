import { React, useState, useEffect } from "react";
import http from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import Fab from "@mui/material/Fab";
import EventIcon from "@mui/icons-material/Event";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [myTeams, setMyTeams] = useState(undefined);
  const [allTeams, setAllTeams] = useState(undefined);
  const [existingTeams, setExistingTeams] = useState(undefined);
  const [selectedTeam, setSelectedTeam] = useState(undefined);
  const [createEventButtonClicked, setCreateEventButtonClicked] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDateFrom, setEventDateFrom] = useState("");
  const [eventDateTo, setEventDateTo] = useState("");

  const token = sessionStorage.getItem("token");

  const getMyTeams = async () => {
    const response = await http.get("http://localhost:4000/api/dashboard/myteams", {
      headers: { authorization: token },
    });
    console.log(response.data);
    setMyTeams(response.data);
  };

  const getAllTeams = async () => {
    const response = await http.get("http://localhost:4000/api/dashboard/allteams", {
      headers: { authorization: token },
    });
    setAllTeams(response.data);
  };

  const joinToTeam = async (data, name) => {
    const response = await http.post(
      "http://localhost:4000/api/dashboard/join",
      {
        teamname: data,
        name: name,
      },
      { headers: { authorization: token } }
    );
    getMyTeams();
  };

  const createExistingTeamsArray = () => {
    if (myTeams !== undefined && allTeams !== undefined) {
      let container = [];
      container = allTeams.map((team) => team).filter((el) => !myTeams.team.map((myTeam) => myTeam).includes(el.name));
      setExistingTeams(container);
    }
  };

  const getSelectedTeam = async (team) => {
    if (team === undefined) return setSelectedTeam(team);
    const response = await http.post(
      "http://localhost:4000/api/dashboard/team",
      {
        teamname: team,
      },
      { headers: { authorization: token } }
    );
    setSelectedTeam(response.data);
  };

  const makeMeGod = async (team, name) => {
    console.log(team, name);
    const response = await http.post(
      "http://localhost:4000/api/dashboard/makemegod",
      {
        teamname: selectedTeam.name,
        name: myTeams.username,
      },
      { headers: { authorization: token } }
    );
    getSelectedTeam();
  };

  const removeFromTeam = async (team, name) => {
    const response = await http.post(
      "http://localhost:4000/api/dashboard/team/remove",
      {
        teamname: selectedTeam.name,
        name: myTeams.username,
      },
      { headers: { authorization: token } }
    );
    // getSelectedTeam()
  };

  const createEvent = async (teamName, title, location, from, to) => {
    try {
      const response = await http.post(
        "http://localhost:4000/api/dashboard/event/create",
        {
          teamname: teamName,
          title: title,
          location: location,
          dateFrom: from,
          dateTo: to,
        },
        { headers: { authorization: token } }
      );
      return navigate("/dashboard");
    } catch (err) {
      console.log(err);
      if (!err.response) console.log("Server error");
    }
  };

  const authGoogle = () => {
    window.open(
      "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=691448754491-a375iq0cogn7sg5ig7901non5p4gviaa.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/calendar.events&redirect_uri=http://localhost:3000/dashboard&prompt=select_account"
    );
  };

  const sendCode = async (code) => {
    const response = await http.post(
      "http://localhost:4000/api/authorize-google-calendar",
      {
        code,
      },
      {
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
      }
    );
    console.log(response);
  };

  useEffect(() => {
    getMyTeams();
    getAllTeams();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    createExistingTeamsArray();
    // eslint-disable-next-line
  }, [allTeams, myTeams]);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) sendCode(code);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="dashboardContainer flex-container">
        <section className="sections section1">
          <h2 className="h2title">My teams</h2>
          <p>After joining a team, you'll see it: </p>
          <div className="buttonHolder">
            {myTeams === undefined
              ? "Loading..."
              : myTeams.team.map((myTeam) => (
                  <Button variant="contained" key={myTeam} onClick={() => getSelectedTeam(myTeam)}>
                    {myTeam}
                  </Button>
                ))}
          </div>
        </section>

        <section className="sections section2">
          <h2 className="h2title">Create a new team</h2>
          <p>
            Cannot find your group or just wanna meet new Teqball enthusiasts? Create a new team by clicin' the button!
          </p>
          <Button className="createTeam" onClick={() => navigate("/create-team")} variant="contained" color="secondary">
            Create a new team
          </Button>
        </section>

        <section className="sections section3">
          <h2 className="h2title">Join an existing team</h2>
          <div className="joinTeamCard">
            {existingTeams === undefined
              ? "Loading..."
              : existingTeams.map((team) => (
                  <div key={team.name} className="existingTeamCard">
                    <p>
                      <span className="boldText">Teamname:</span> {team.name}
                    </p>
                    <span className="boldText">Admin:</span>
                    <div className="adminSort">
                      {team.admins.map((admin, index) => (
                        <div key={index}>{admin}</div>
                      ))}
                    </div>
                    <Button variant="contained" onClick={() => joinToTeam(team.name, myTeams.username)}>
                      Join
                    </Button>
                  </div>
                ))}
          </div>
          {/* >>>>>>> development */}
        </section>

        {selectedTeam === undefined ? (
          ""
        ) : (
          <section className="sections section4">
            <h2 className="h2title2">Selected Team</h2>
            <div className="buttonHolder">
              <Button
                type="submit"
                variant="contained"
                size="small"
                key={selectedTeam.name}
                onClick={() => getSelectedTeam(undefined)}>
                Back
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="error"
                key={selectedTeam.name + 1}
                size="small"
                onClick={() => removeFromTeam(selectedTeam.name, myTeams.username)}>
                Remove
              </Button>
            </div>
            <div className="selectedTeam">
              <div className="teamName">
                <p className="boldText">Team name:</p>
                <p>{selectedTeam.name}</p>
              </div>

              <div className="teamAdmins">
                <p className="boldText">Admins:</p>
                <ul>
                  {selectedTeam.admins.map((admin) => (
                    <li key={admin}>{admin}</li>
                  ))}
                </ul>

                <div>
                  {selectedTeam.admins.includes(myTeams.username) ? (
                    ""
                  ) : (
                    <>
                      <Button
                        type="submit"
                        variant="outlined"
                        color="warning"
                        key={selectedTeam.name + 2}
                        size="small"
                        onClick={() => makeMeGod(selectedTeam.name, myTeams.username)}>
                        Make me God
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="teamPlayers">
                <p className="boldText">Players:</p>
                <ul>
                  {selectedTeam.players.map((player) => (
                    <li key={player}>{player}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="eventsCard">
              <h4>Events:</h4>
              <ul>
                {selectedTeam.events.map((event, index) => (
                  <li key={event.title}>{event.title}</li>
                ))}
              </ul>
            </div>

            <div>
              {selectedTeam.admins.includes(myTeams.username) ? (
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    key={selectedTeam.name + 3}
                    size="small"
                    onClick={() => setCreateEventButtonClicked(true)}>
                    Create event
                  </Button>
                </>
              ) : (
                ""
              )}
            </div>
          </section>
        )}
        {createEventButtonClicked === false ? (
          ""
        ) : (
          <section>
            <div className="dashboardContainer flex-container">
              <h2>Create new Event</h2>
              <TextField
                type="text"
                label="Title"
                name="title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <TextField
                type="text"
                label="Location"
                name="location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
              <TextField
                type="date"
                label="From"
                name="dateFrom"
                value={eventDateFrom}
                onChange={(e) => setEventDateFrom(e.target.value)}
              />
              <TextField
                type="date"
                label="To:"
                name="dateTo"
                value={eventDateTo}
                onChange={(e) => setEventDateTo(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => createEvent(selectedTeam.name, eventTitle, eventLocation, eventDateFrom, eventDateTo)}>
                Create
              </Button>
              <Button
                type="submit"
                variant="contained"
                key={selectedTeam.name + 4}
                onClick={() => setCreateEventButtonClicked(false)}>
                Back
              </Button>
            </div>
          </section>
        )}
        <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: "30px", right: "30px" }}>
          <EventIcon onClick={authGoogle} />
        </Fab>
      </div>
    </>
  );
};

export default Dashboard;
