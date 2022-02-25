// creates the express server
require("dotenv").config();
const { PORT = 3000 } = process.env;
const express = require("express");
const server = express();
const morgan = require("morgan");
const cors = require("cors");

server.use(morgan("dev"));
server.use(cors());
server.use(express.json());

const apiRouter = require('./api');
server.use('/api', apiRouter);

const client = require("./db/client");

server.get("*", (req, res, next) => {
  res.status(404).send("Page not Found");
})

server.use((error, req, res, next) => {
  res.status(500).send(error);
})

server.listen(PORT, () => {
  client.connect();
  console.log(`Listening on http://localhost:${PORT}`);
});
