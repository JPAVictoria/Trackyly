require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();

const registerRouter = require("./routes/auth/register/register.route");
const loginRouter = require("./routes/auth/login/login.route");
const forgotRouter = require("./routes/auth/forgot/forgot.route");
const resetRouter = require("./routes/auth/reset/reset.route");
const statisticsRouter = require("./routes/statistics/statistics.route");
const usersRoute = require("./routes/configureUser/configureUser.route");
const formRoute = require("./routes/sosform/sosform.route");
const analyticsRoute = require("./routes/analytics/analytics.route");

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/user/register", registerRouter);
app.use("/user/login", loginRouter);
app.use("/user/forgot", forgotRouter);
app.use("/user/reset", resetRouter);
app.use("/user/statistics", statisticsRouter);
app.use("/user/configureUser", usersRoute);
app.use("/user/sosform", formRoute);
app.use("/user/analytics", analyticsRoute);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
