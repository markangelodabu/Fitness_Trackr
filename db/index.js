// requires and re-exports all files in this db directory
module.exports = {
  ...require("./users.js"),
  ...require("./activities.js"),
  ...require("./routines"),
  ...require("./routine_activities"),
};
