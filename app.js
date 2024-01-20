//Imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

//Routes
const userRoutes = require("./routes/routes.js");
//Server
const app = express();
const PORT = process.env.PORT || 3001;

//using Imports
app.use(cors({ credentials: true, origin: true }));
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());
app.use(mongoSanitize());

mongo_url = process.env.MONGO_URL;

// Connect to MongoDB (NoSQL-Database), and perform CRUD operations
mongoose
  .connect(mongo_url)
  .then(() => console.log("Successful DB connection"))
  .catch((err) => console.error(err));

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, console.log("server started at port: " + PORT));

module.exports = app;
