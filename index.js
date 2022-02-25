// creates the express server
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const server = express();
const client = require("./db/client");
const { PORT } = process.env;

server.use(morgan("dev"));
server.use(express.json());

server.listen(PORT, () => {
  client.connect();
  console.log(`Listening on http://localhost:${PORT}`);
});
