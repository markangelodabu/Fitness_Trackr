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
const { requireUser } = require("./utils");


routinesRouter.get("/", async (req, res) => {
  const routines = await getAllPublicRoutines();
  res.send({ 
    routines
  });
});

module.exports = routinesRouter;

routinesRouter.post("/", requireUser, async (req, res) => {
const {isPublic, name, goal} = req.body;
const routineData = {};

try {
  routineData.isPublic = isPublic;
  routineData.name = name;
  routineData.goal = goal;

  const routine = await createRoutine(routineData);
  res.send(
    routine
  )
} catch (error) {
  next(error)
}
})
