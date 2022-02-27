const client = require("./client");
const util = require("util");

const getRoutineById = async (id) => {
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

    if (!routine) {
      throw {
        name: "RoutineNotFoundError",
        message: "Routine is not found with the given id",
      };
    }

    return routine;
  } catch (error) {
    console.log("Error at getRoutineById", error);
    throw error;
  }
};

const getRoutinesWithoutActivities = async () => {
  try {
    const { rows: routines } = await client.query(`
            SELECT * FROM routines
        `);

    return routines;
  } catch (error) {
    console.log("Error at getRoutinesWithoutActivities", error);
    throw error;
  }
};

//helper function
const addActivitiesToRoutines = async (routines) => {
  try {
    const routineIdArray = routines.map((routine) => {
      return routine.id;
    });

    // routineActivityId created for the frontend part of the project
    const { rows: activities } = await client.query(`
                SELECT activities.*, routine_activities.count, routine_activities.duration, routine_activities."routineId", routine_activities.id AS "routineActivityId"
                FROM activities
                JOIN routine_activities 
                ON activities.id = routine_activities."activityId"
                WHERE routine_activities."routineId" IN (${routineIdArray});
            `);

    routines.forEach((routine) => {
      routine.activities = activities.filter((activity) => {
        return activity.routineId === routine.id;
      });
    });

    return routines;
  } catch (error) {
    throw error;
  }
};

const getAllRoutines = async () => {
  try {
    const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName"
            FROM routines
            JOIN users ON routines."creatorId" = users.id; 
        `);

    console.log("routines", util.inspect(routines, true, 5, true));
    return await addActivitiesToRoutines(routines);
  } catch (error) {
    console.log("Error at getAllRoutes", error);
    throw error;
  }
};

const getAllPublicRoutines = async () => {
  try {
    const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName"
            FROM routines
            JOIN users 
            ON routines."creatorId" = users.id
            WHERE routines."isPublic" = true;
        `);

    return await addActivitiesToRoutines(routines);
  } catch (error) {
    console.log("Error at getAllPublicRoutines", error);
    throw error;
  }
};

const getAllRoutinesByUser = async ({ username }) => {
  try {
    const { rows: routines } = await client.query(
      `
            SELECT routines.*, users.username AS "creatorName" 
            FROM routines
            JOIN users ON routines."creatorId" = users.id
            WHERE users.username = $1;
        `,
      [username]
    );

    return await addActivitiesToRoutines(routines);
  } catch (error) {
    console.log("Error at getAllRoutinesByUser", error);
    throw error;
  }
};

const getPublicRoutinesByUser = async ({ username }) => {
  try {
    const { rows: routines } = await client.query(
      `
            SELECT routines.*, users.username AS "creatorName" 
            FROM routines
            JOIN users ON routines."creatorId" = users.id
            WHERE users.username = $1 
            AND routines."isPublic" = true
        `,
      [username]
    );

    return await addActivitiesToRoutines(routines);
  } catch (error) {
    console.log("Error at getPublicRoutinesByUser", error);
    throw error;
  }
};

const getPublicRoutinesByActivity = async ({ id: activityId }) => {
  try {
    const { rows: routines } = await client.query(
      `
            SELECT routines.*, users.username AS "creatorName" 
            FROM routines
            JOIN users 
            ON routines."creatorId" = users.id
            JOIN routine_activities
            ON routines.id = routine_activities."routineId"
            WHERE "isPublic" = true
            AND routine_activities."activityId" = $1;
            
        `,
      [activityId]
    );
    return await addActivitiesToRoutines(routines);
  } catch (error) {
    console.log("Error at getPublicRoutinesByActivity", error);
    throw error;
  }
};

const createRoutine = async ({ creatorId, isPublic, name, goal }) => {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            INSERT INTO routines("creatorId", "isPublic", name, goal)
            VALUES($1, $2, $3, $4)
            RETURNING *
        `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    console.log("Error at createRoutine", error);
    throw error;
  }
};

const updateRoutine = async ({ id, ...fields }) => {
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
      rows: [routine],
    } = await client.query(
      `
          UPDATE routines
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
          `,
      Object.values(fields)
    );
    return routine;
  } catch (error) {
    console.log("Error at updateRoutine", error);
    throw error;
  }
};

const destroyRoutine = async (id) => {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            DELETE FROM routines
            WHERE id = $1
            RETURNING *;
        `,
      [id]
    );

    await client.query(
      `
        DELETE FROM routine_activities
        WHERE "routineId" = $1
        RETURNING *;
    `,
      [id]
    );

    return routine;
  } catch (error) {
    console.log("Error at destroyRoutine", error);
    throw error;
  }
};

module.exports = {
  client,
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
};
