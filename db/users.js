const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const getUsers = async () => {
  const { rows: users } = await client.query(`
        SELECT * FROM users;
    `);
  return users;
};

const createUser = async ({ username, password }) => {
  const hashPwd = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            RETURNING *;
        `,
      [username, hashPwd]
    );
    delete user.password;
    console.log(user);
    return user;
  } catch (error) {
    throw error;
  }
};
const getUser = async ({ username, password }) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users
        WHERE username = $1;
      `,
      [username]
    );
    console.log("Before return", user);
    if (!user) {
      throw { name: "userNotFound", message: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      delete user.password;
      return user;
    }
  } catch (error) {
    console.log("Error with getUser");
    throw error;
  }
};
const getUserById = async (id) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username, password
      FROM users
      WHERE id = $1;
      `,
      [id]
    );
    delete user.password;
    console.log("This is getUserById", user);
    return user;
  } catch (error) {
    console.log("Error with getUserById");
    throw error;
  }
};
const getUserByUsername = async (username) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users
        WHERE username = $1;
      `,
      [username]
    );
    return user;
  } catch (error) {
    console.log("Error with getUserByUsername");
    throw error;
  }
};

module.exports = {
  client,
  createUser,
  getUsers,
  getUser,
  getUserById,
  getUserByUsername,
};
