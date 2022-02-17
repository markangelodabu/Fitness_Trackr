// create the express server here
const express = require('express');
const server = express();
const morgan = require('morgan');
const { client } = require('./db/client');
require('dotenv').config();
const {PORT} = process.env;


server.listen(PORT, () => {
    client.connect();
    console.log(`Listening on http://localhost:${PORT}`);
})
