const express = require("express");
const routinesRouter = express.Router();
const {
  getRoutineById,
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  addActivityToRoutine,
  destroyRoutine
} = require("../db");
const { requireUser } = require("./utils");


routinesRouter.get("/", async (req, res) => {
  const routines = await getAllPublicRoutines();

  res.send(
    routines
  );
});

routinesRouter.post("/", requireUser, async (req, res) => {
  const {isPublic, name, goal} = req.body;
  const routineData = {};
  
  try {
    routineData.creatorId = req.user.id;
    routineData.isPublic = isPublic;
    routineData.name = name;
    routineData.goal = goal;

    const routine = await createRoutine(routineData);

    if (!routine) {
      next({
        name: "UserNotAuthorized",
        message: "User is not authorize to create a routine"
      })
    }

    res.send(routine);
  } catch ({name, message}) {
    next({name, message})
  }
})
  
routinesRouter.patch("/:routineId", async (req, res, next) => {
  const { routineId } = req.params;
  const { isPublic, name, goal } = req.body

  try {
    
    const routineById = await getRoutineById(routineId);

    if (routineById.creatorId === req.user.id) {
      const updatedRoutine = await updateRoutine({
        id: routineId,
        isPublic,
        name,
        goal
      });
      res.send(updatedRoutine);
    } else {
      next({
        name: "userUnauthorizeToUpdate",
        message: "User is not authorize to make an update"
      })
    }
  } catch ({name, message}) {
    next({name, message});
  }
})

routinesRouter.delete("/:routineId", async (req, res, next) => {
  const { routineId } = req.params;
  console.log("Here is the routine id", routineId)
  try {
    const routineById = await getRoutineById(routineId)
    console.log("this is the routine by id", routineById)
    if (routineById.creatorId === req.user.id) {
      const Routine = await destroyRoutine(routineId)
      console.log("this is the routine from destroyRoutine", Routine)
      res.send(Routine)
    } else {
      next({
        name: "userUnauthorizeToDelete",
        message: "User is not authorize to delete a routine"
      })
    }
  } catch ({name, message}) {
    next ({name, message});
  }
});

routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;
  try {
    const activity = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration
    });
    res.send(
      activity
    )
  } catch (error) {
    next (error)
  }
});

module.exports = routinesRouter;
