require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("axios");
const port = process.env.PORT;

// routes
const publicRouter = require("./routes/public");
const dashboardRouter = require("./routes/dashboard");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const teamRouter = require("./routes/teams");

// controllers
// const { initBaseData, initAuthEntity } = require("./controllers/base");

app.use(cors());
app.use(express.json());

app.use("/api/public", publicRouter);
app.use("/api/team", teamRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);

const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  let verified;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return (verified = false);
    verified = decoded;
  });
  return verified;
};

const User = require("./models/user");

app.post("/api/authorize-google-calendar", async (req, res) => {
  if (!req.headers) return res.sendStatus(401);
  const verified = verifyToken(req.headers.authorization);
  if (!verified) return res.sendStatus(401);

  const userId = verified.id;
  const user = await User.findOne({ _id: userId });
  if (!user) return res.sendStatus(401);

  const code = req.body.code;
  try {
    const response = await http.post("https://oauth2.googleapis.com/token", {
      code: code,
      client_id: "691448754491-a375iq0cogn7sg5ig7901non5p4gviaa.apps.googleusercontent.com",
      client_secret: "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",
      redirect_uri: "http://localhost:3000/dashboard",
      grant_type: "authorization_code",
    });
    user.googleCalendarAccessToken = response.data.access_token;
    user
      .save()
      .then(() => res.sendStatus(200))
      .catch((err) => {
        return res.status(500).json(err);
      });
  } catch (err) {
    console.log(err.response.data);
    res.sendStatus(500);
  }
});

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// mongoose.connection
//   .dropDatabase()
//   .then(() => console.log("database deleted"))
//   .catch((err) => console.log(err));

// initBaseData()
//   .then((info) => console.log(info))
//   .catch((err) => console.log(err));
// initAuthEntity()
//   .then((info) => console.log(info))
//   .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Teqball is listening on port ${port}`);
});

/*

*/
