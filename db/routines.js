const client = require("./client")

const getRoutineById = async(id) => {
    try {
        const {rows: [routine]} = await client.query(`
            SELECT * 
            FROM routines
            WHERE id = $1;
        `, [id]
        );

        if (!routine) {
            throw {
                name: "RoutineNotFoundError",
                message: "Routine is not found with the given id"
            }
        }

        return routine;
    }   catch (error) {
        console.log("Error at getRoutineById", error)
        throw error
    }
}

const getRoutinesWithoutActivities = async () => {
    try {
        const {rows: routines} = await client.query(`
            SELECT * FROM routines
        `)

        return routines
    }   catch (error) {
        console.log("Error at getRoutinesWithoutActivities", error)
        throw error
    }
}

const getAllRoutines = async () => {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName"
            FROM routines
            JOIN users ON routines."creatorId" = users.id; 
        `)

        const { rows: activities } = await client.query(`
            SELECT activities.*, routine_activities.count, routine_activities.duration, routine_activities."routineId"
            FROM activities
            JOIN routine_activities ON activities.id = routine_activities."activityId";
        `)

        routines.forEach((routine) => {
            routine.activities = activities.filter(activity => routine.id === activity.routineId);
        })
        console.log(activities)
        console.log(routines)
        return routines;
    }   catch (error) {
        console.log("Error at getAllRoutes", error)
        throw error
    }
}

const getAllPublicRoutines = async () => {
    try {
        const {rows: routines} = await client.query(`
            SELECT routines.*, users.username AS creatorName
            FROM routines
            WHERE "isPublic" = true
            JOIN users ON routines."creatorId" = users.id
        `)

        const { rows: activities } = await client.query(`
            SELECT activities.*, routine_activities.count, routine_activities.duration, routine_activities."routineId"
            FROM activities
            JOIN routine_activites ON activities.id = routine_activities."activityId";
        `) 

        routines.forEach((routine) => {
            routine.activities = activities.filter(activity => routine.id ===activity.routineId);
        })

        return routines;
    }   catch (error) {
        console.log("Error at getAllPublicRoutines", error)
        throw error
    }
}

const getAllRoutinesByUser = async ({username}) => {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS creatorName 
            FROM routines
            WHERE username = $1
            JOIN users ON routines."creatorId" = user.id
        `, [username]);

        const { rows: activities } = await client.query(`
        SELECT activities.*, routine_activities.count, routine_activities.duration, routine_activities."routineId"
        FROM activities
        JOIN routine_activites ON activities.id = routine_activities."activityId";
        `)

        routines.forEach((routine) => {
            routine.activities = activities.filter(activity => routine.id ===activity.routineId);
        })

        return routines;
    }   catch (error) {
        console.log("Error at getAllRoutinesByUser", error)
        throw error
    }
}

const getPublicRoutinesByUser = async ({username}) => {
    try {
        const { rows: routines } = await client.query(`
            SELECT * 
            FROM routines
            WHERE "isPublic" = true
            WHERE username = $1
            JOIN users ON routines."creatorId" = user.id
        `, [username]);

        const { rows: activities } = await client.query(`
        SELECT activities.*, routine_activities.count, routine_activities.duration, routine_activities."routineId"
        FROM activities
        JOIN routine_activites ON activities.id = routine_activities."activityId";
        `)

        routines.forEach((routine) => {
            routine.activities = activities.filter(activity => routine.id ===activity.routineId);
        })

        return routines;
    }   catch (error) {
        console.log("Error at getPublicRoutinesByUser", error)
        throw error
    }
}

const getPublicRoutinesByActivity = async ({id}) => {
    try {
        const { rows: routines } = await client.query(`
            SELECT * 
            FROM routines
            WHERE id = $1
            JOIN users ON routines."creatorId: = user.id
        `, [id]);

        const { rows: activities } = await client.query(`
        SELECT activities.*, routine_activities.count, routine_activities.duration, routine_activities."routineId"
        FROM activities
        JOIN routine_activites ON activities.id = routine_activities."activityId";
        `)

        routines.forEach((routine) => {
            routine.activities = activities.filter(activity => routine.id ===activity.routineId);
        })

        return routines;
    }   catch (error) {
        console.log("Error at getPublicRoutinesByActivity", error)
        throw error 
    }
}

const createRoutine = async ({creatorId, isPublic, name, goal}) => {
    try {
        const { rows: [routine] } = await client.query(`
            INSERT INTO routines("creatorId", "isPublic", name, goal)
            VALUES($1, $2, $3, $4)
            RETURNING *
        `, [creatorId, isPublic, name, goal]
        );
        return routine;
    }   catch (error) {
        console.log("Error at createRoutine", error)
        throw error
    }
}

const updateRoutine = async({id, ...fields}) => {
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
}

const destroyRoutine = async(id) => {
    try {
        const { rows: [routine] } = await client.query(`
            DELETE FROM routines
            WHERE id = $1
            RETURNING *;
        `, [id])

        return routine;
    }   catch (error) {
        console.log("Error at destroyRoutine", error);
        throw error;
    }
}

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
    destroyRoutine
}
