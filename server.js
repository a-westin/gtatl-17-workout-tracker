const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const db = require("./models");
const workoutController = require("./controllers/workoutController");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.on("connected", () => {
  console.log("Mongoose successfully connected.");
});
connection.on("error", (err) => {
  console.log("Mongoose connection error: ", err);
});

app.get("/api/config", (req, res) => {
  res.json({
    success: true,
  });
});

app.post("/api/workouts", function (req, res) {
  db.Workout.create(req.body)
    .then(function (newWorkout) {
      res.json(newWorkout);
      console.log("Successfully hit this route");
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: true,
        data: null,
        message: "Failed to post workouts.",
      });
    });
});
app.use(workoutController);
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
