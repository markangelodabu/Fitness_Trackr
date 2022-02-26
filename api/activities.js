const express = require("express");
const activitiesRouter = express.Router();
const {
  getActivityById,
  getAllActivities,
  createActivity,
  updateActivity,
} = require("../db");

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

module.exports = activitiesRouter;
