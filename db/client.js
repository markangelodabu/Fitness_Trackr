// build and export your unconnected client here
const {Client} = require('pg');
const CONNECTION_STRING = "postgres://localhost:5432/fitness-dev";
const client = new Client(CONNECTION_STRING);

module.exports = {
    client
}
