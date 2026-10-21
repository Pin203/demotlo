const pool = require("../config/db");

async function createUser(id, name, email, password) {
  await pool.query(
    "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
    [id, name, email, password]
  );
}

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
}

module.exports = { createUser, findUserByEmail };