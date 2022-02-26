// create an api router
const express = require("express");
const apiRouter = express.Router();

// attach other routers from files in this api directory (users, activities...)

apiRouter.get("/health", async (req, res, next) => {
  res.send({
    message: "All is well"
  });
});
const usersRouter = require("./users");
const routinesRouter = require("./routines");
const activitiesRouter = require("./activities");

apiRouter.use("/users", usersRouter);
apiRouter.use("/routines", routinesRouter);
apiRouter.use("/activities", activitiesRouter);

// export the api router
module.exports = apiRouter;
