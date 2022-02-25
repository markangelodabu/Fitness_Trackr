const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env;

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});

const { createUser, getUserByUsername, getUser, getUsers, getUserById } = require("../db");

usersRouter.get("/", async (req, res) => {
  const users = await getUsers();
  res.send({
    users,
  });
});

usersRouter.post("/register", async(req, res, next) => {
  const {username, password} = req.body;
  
  try {
    const existingUser = await getUserByUsername(username);
    
    if ( existingUser ) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    }

    const user = await createUser({username, password});
    // if (password.length < 8) {
    //   next({
    //     name: "PasswordTooShort",
    //     message: "Please create a password that has 8 characters or more"
    //   })
    // }

    const token = jwt.sign({ 
      id: user.id, 
      username
    }, process.env.JWT_SECRET);

    res.send({
      token 
    });
  } catch ({name, message}) {
    console.log({name, message});
    next({name, message});  
  }
})

usersRouter.post("/login", async(req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both username and password"
    })
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password === password) {
      const token = jwt.sign(user, JWT_SECRET);
      res.send({message: "You're logged in!", token});
    } else {
        next({
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
});

usersRouter.post("/me", async (req, res, next) => {

})

module.exports = usersRouter;
