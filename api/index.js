// create an api router
const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");
const { JWT_SECRET } = process.env;

// attach other routers from files in this api directory (users, activities...)

apiRouter.get("/health", async (req, res, next) => {
  res.send({
    message: "All is well",
  });
});

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    // const token = auth.slice(prefix.length);

    const [, token] = auth.split(" ");
    //BEARER ksnkanlkdsalksmdlksacnsjanksaas

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});

const usersRouter = require("./users");
const routinesRouter = require("./routines");
const activitiesRouter = require("./activities");
const routineActivitiesRouter = require("./routine_activities");

apiRouter.use("/users", usersRouter);
apiRouter.use("/routines", routinesRouter);
apiRouter.use("/activities", activitiesRouter);
apiRouter.use("/routine_activities", routineActivitiesRouter);

// export the api router
module.exports = apiRouter;
