const express = require("express");
const router = express.Router();
const db = require("../models");
const path = require("path");

// Getting HTML routes
router.get('/exercise', function (req, res) {

  res.sendFile(path.join(__dirname, "../public/exercise.html"));

});

router.get('/stats', function (req, res) {

  res.sendFile(path.join(__dirname, "../public/stats.html"));

});

router.get("/", function (req, res) {

  res.sendFile(path.join(__dirname, "../public/index.html"));

});

router.get("/api/workouts", function (req, res) {
  db.Workout.find({})
    .then((workouts) => {
      console.log(workouts);
      res.json(workouts);
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: true,
        data: null,
        message: "Failed to retrieve workouts",
      });
    });
});
router.post("/api/workout", (req, res) => {
  db.Workout.create(req.body)
    .then((newWorkout) => {
      res.json(newWorkout);
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: true,
        data: null,
        message: "Failed to create new exercise",
      });
    });
});
module.exports = router;
