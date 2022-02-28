const client = require("./client");

const getRoutineActivityById = async (id) => {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
        SELECT *
        FROM routine_activities
        WHERE id=$1
      `,
      [id]
    );
    return routine_activity;
  } catch (error) {
    console.log("Error at getRoutineActivityById", error);
    throw error;
  }
};

const addActivityToRoutine = async ({
  routineId,
  activityId,
  count,
  duration,
}) => {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
        INSERT INTO routine_activities("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
      [routineId, activityId, count, duration]
    );
    return routine_activity;
  } catch (error) {
    throw error;
  }
};
const updateRoutineActivity = async ({ id, ...fields }) => {
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
      rows: [routine_activity],
    } = await client.query(
      `
          UPDATE routine_activities
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
          `,
      Object.values(fields)
    );
    return routine_activity;
  } catch (error) {
    console.log("Error in updateRoutineActivity", error);
    throw error;
  }
};
const destroyRoutineActivity = async (id) => {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
        DELETE FROM routine_activities
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );
    return routine_activity;
  } catch (error) {
    console.log("Error in destroyRoutineActivity", error);
    throw error;
  }
};
const getRoutineActivitiesByRoutine = async ({ id }) => {
  try {
    const { rows: routine_activities } = await client.query(
      `
              SELECT *
              FROM routine_activities
              WHERE "routineId" = $1;
          `,
      [id]
    );
    return routine_activities;
  } catch (error) {
    console.log("Error in getRoutineActivitiesByRoutine", error);
    throw error;
  }
};

module.exports = {
  client,
  getRoutineActivityById,
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
};
