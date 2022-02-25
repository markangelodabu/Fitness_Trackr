const express = require("express");
const routinesRouter = express.Router();
const { getAllRoutines } = require("../db");

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
