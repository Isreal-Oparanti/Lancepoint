const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const otpGenerator = require("otp-generator");

const routes = require("./routes/Routes.js");
// const PasswordRecoveryRoute = require('./routes/PasswordRecoveryRoute.js');

const app = express();

// env configurations
dotenv.config();

const mongoURI =
  "mongodb+srv://Isreal:oparanti@cluster0.pkhckh1.mongodb.net/LancePoint?retryWrites=true&w=majority&appName=Cluster0";
// const mongoURI = "mongodb://localhost:27017/Hackathon"

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin: "http://localhost:5173"
}));

///routes
app.use("/api", routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
