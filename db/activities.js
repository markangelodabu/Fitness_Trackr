const client = require("./client");

const getAllActivities = async () => {
  const { rows: activities } = await client.query(`
          SELECT * FROM activities;
      `);
  return activities;
};

const createActivity = async ({ name, description }) => {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
              INSERT INTO activities(name, description)
              VALUES ($1, $2)
              RETURNING *;
          `,
      [name, description]
    );
    console.log(activity);
    return activity;
  } catch (error) {
    throw error;
  }
};

const updateActivity = async ({ id, ...fields }) => {
  const setString = Object.keys(fields)
    .map((field, index) => {
      return `"${field}" = $${index + 1}`;
    })
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
          UPDATE activities
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
          `,
      Object.values(fields)
    );
    return activity;
  } catch (error) {
    console.log("Error at updateActivity");
    throw error;
  }
};

module.exports = {
  client,
  getAllActivities,
  createActivity,
  updateActivity,
};
