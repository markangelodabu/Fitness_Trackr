const express = require("express");
const routineActivitiesRouter = express.Router();
const { requireUser } = require("./utils");

const {
  destroyRoutineActivity,
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
} = require("../db");

routineActivitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    try {
      const routineActivityById = await getRoutineActivityById(
        routineActivityId
      );
      const routine = await getRoutineById(routineActivityById.routineId);

      if (routine.creatorId === req.user.id) {
        const updatedRoutineActivity = await updateRoutineActivity({
          id: routineActivityId,
          count,
          duration,
        });
        res.send(updatedRoutineActivity);
      } else {
        next({
          name: "UserUnauthorizedToUpdateRoutineActivity",
          message: "The user doesn't have the juice for this kinda move.",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);
routineActivitiesRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;
    try {
      const routineActivityById = await getRoutineActivityById(
        routineActivityId
      );
      const routine = await getRoutineById(routineActivityById.routineId);
      if (routine.creatorId === req.user.id) {
        const routineActivity = await destroyRoutineActivity(routineActivityId);
        res.send(routineActivity);
      } else {
        next({
          name: "UserUnauthorizedToDeleteRoutineActivity",
          message: "This user is not allowed to perform this action.",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

module.exports = routineActivitiesRouter;
