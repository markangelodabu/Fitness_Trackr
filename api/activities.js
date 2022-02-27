const express = require("express");
const activitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const {
  getActivityById,
  getAllActivities,
  createActivity,
  updateActivity,
} = require("../db");
const { requireUser } = require("./utils");

activitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /activities");
  next();
});
activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    console.log(activities);
    res.send(activities);
  } catch (error) {
    console.log("getAllActivities Error", error);
    next(error);
  }
});

activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newActivity = await createActivity({ name, description });

    res.send(newActivity);
  } catch (error) {
    console.log("Error creating new activity", error);
    next(error);
  }
});

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description } = req.body;
    try {
      const aId = await getActivityById(
        activityId
      );
      const updatedActivity = await updateActivity({
        id: aId.id,
        name,
        description,
      });
      res.send(updatedActivity);
    } catch (error) {
      console.log("Error updating an activity", error);
      next(error);
    }
  });

module.exports = activitiesRouter;
