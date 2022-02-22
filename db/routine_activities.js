const client = require("./client");
const {
  getActivityById,
  getAllActivities,
  createActivity,
  updateActivity,
} = require("./activities");
const {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
} = require("./routines");

const getRoutineActivityById = async (id) => {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
        SELECT *
        FROM routines_activities
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
      const { rows: [routine_activity]} = await client.query(`
        INSERT INTO routine_activities("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [routineId,activityId, count, duration]);
      return routine_activity;
  } catch (error) {
    console.log("Error in addActivityToRoutine", error);
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
      const { rows: [routine_activity]} = await client.query(`
        DELETE FROM routine_activities
        WHERE id = $1
        RETURING *;
      `, [id]);
      return routine_activity;
  } catch (error) {
    console.log("Error in destroyRoutineActivity", error);
    throw error;
  }
};
const getRoutineActivitiesByRoutine = async ({ id }) => {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
              SELECT *
              FROM routines
              WHERE id = $1;
          `,
      [id]
    );
    const { rows: activities } = await client.query(
      `
              SELECT activities.*
              FROM activities
              JOIN routine_activities ON activities.id=routine_activities."routineActivityId"
              WHERE routine_activities."routineId"=$1
          `,
      [id]
    );
    const {
      rows: [creator],
    } = await client.query(
      `
          SELECT id, username
          FROM users
          WHERE id=$1;
      `,
      [routine.creatorId]
    );

    routine.activities = activities;
    routine.creator = creator;

    delete routine.creatorId;
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
