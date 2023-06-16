require("dotenv").config();
const express = require("express");
const Connection = require("./config/db");

const cors = require("cors");
const path = require("path");
const ReadFile = require("./file");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
// app.use(
//   session({
//     secret: "secrect",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: true,
//       httpOnly: true,
//     },
//   })
// );
Connection();

app.use("/", require("./routes/user"));
ReadFile();

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
