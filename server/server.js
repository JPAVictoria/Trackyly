const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const registerRouter = require("./api/auth/register/auth.route");
const loginRouter = require("./api/auth/login/auth.route");
const forgotRouter = require("./api/auth/forgot/auth.route");
const resetRouter = require("./api/auth/reset/auth.route");
const statisticsRouter = require("./api/statistics/route");
const usersRoute = require("./api/configureUser/route");

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use("/user/register", registerRouter);
app.use("/user/login", loginRouter);
app.use("/user/forgot", forgotRouter);
app.use("/user/reset", resetRouter);
app.use("/user/statistics", statisticsRouter);
app.use("/user/configureUser", usersRoute);






app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
