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

activitiesRouter.post("/createActivity", async (req, res, next) => {
  const { id, name, description } = req.body;
  try {
    const existingActivity = await getActivityById(id);
    if (existingActivity) {
      next({
        name: "ActivityExistsError",
        message: "This activity already exists",
      });
    }
    const newActivity = await createActivity(name, description);

    const token = jwt.sign(
      {
        id: newActivity.id,
        name,
        description,
      },
      process.env.JWT_SECRET
    );

    res.send({
      token,
    });
    return newActivity;
  } catch ({ name, message }) {
    console.log({ name, message });
    next({ name, message });
  }
});

module.exports = activitiesRouter;
