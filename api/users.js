const express = require("express");
const usersRouter = express.Router();
const { requireUser } = require("./utils");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");

//
const {
  createUser,
  getUserByUsername,
  getUser,
  getUsers,
  getUserById,
} = require("../db");
const { getPublicRoutinesByUser } = require("../db");

// usersRouter.get("/", async (req, res) => {
//   const users = await getUsers();
//   res.send({
//     users
//   });
// });

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both username and password",
    });
    return;
  }

  if (password.length < 8) {
    next({
      name: "PasswordTooShort",
      message: "Please create a password that has 8 characters or more",
    });
    return;
  }

  try {
    const existingUserByUserName = await getUserByUsername(username);

    if (existingUserByUserName) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
      return;
    }

    const user = await createUser({ username, password });

    res.send({
      user,
    });
  } catch ({ name, message }) {
    console.log({ name, message });
    next({ name, message });
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  // console.log("username", username);
  // console.log("password", password);

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const token = jwt.sign(user, JWT_SECRET);
      res.send({ token, message: "You're logged in!" });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {
  res.send(req.user);
});

usersRouter.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  const user = await getUserByUsername(username);
  try {
    const routinesByUsername = await getPublicRoutinesByUser(user);
    res.send(routinesByUsername);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
