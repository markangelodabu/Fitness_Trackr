const express = require("express");
const routinesRouter = express.Router();
const {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
} = require("../db");

routinesRouter.use((req, res, next) => {
  console.log("A request is being made to /routines");
  next();
});
routinesRouter.get("/", async (req, res) => {
  const routines = await getAllRoutines();
  res.send({
    routines,
  });
});

module.exports = routinesRouter;
