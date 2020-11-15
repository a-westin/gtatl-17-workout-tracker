const express = require("express");
const router = express.Router();
const db = require("../models");
const path = require("path");

// Getting HTML routes
router.get("/exercise", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/exercise.html"));
});

router.get("/stats", function (req, res) {
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

router.get("api/workouts/:id", (req, res) => {
  db.Workout.findById(req.params.id)
    .then((foundWorkout) => {
      res.json(foundWorkout);
    })
    .catch((err) => {
      res.json({
        error: true,
        data: null,
        message: "Failed to retrieve workout",
      });
    });
});

// Creating a new workout
router.post("/api/workouts", (req, res) => {
  db.Workout.create(req.body)
    .then((newWorkout) => {
      res.json(newWorkout);
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: true,
        data: null,
        message: "Failed to create new workout",
      });
    });
});

router.put("/api/workouts/:id", (req, res) => {
  // Validating the exercise before pushing to data base
  const exercise = req.body;
  console.log("Exercise: " + exercise);

  if (exercise.type === "resistance") {
    if (
      exercise.name === "" &&
      exercise.duration === 0 &&
      exercise.weight === 0 &&
      exercise.reps === 0 &&
      exercise.sets === 0
    ) {
      console.log("Invalid values; failed to update");
      return res.json({
        error: true,
        data: null,
        message: "Invalid values; failed to update",
      });
    }
  } else if (exercise.type === "cardio") {
    if (
      exercise.name === "" &&
      exercise.duration === 0 &&
      exercise.distance === 0
    ) {
      console.log("Invalid values; failed to update");
      return res.json({
        error: true,
        data: null,
        message: "Invalid values; failed to update",
      });
    }
  }

  // Adding an exercise to workout
  db.Workout.findByIdAndUpdate(
    req.params.id,
    {
      $push: { exercises: req.body },
    },
    { new: true }
  )
    .then((updatedWorkout) => {
      res.json(updatedWorkout);
    })
    .catch((err) => {
      res.json({
        error: true,
        data: null,
        message: "Failed to update workout",
      });
    });
});

// Get the workouts within the range
router.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
    .limit(7)
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

module.exports = router;
