const pool = require("./db");

async function getUserPasswordAndAdminStatus(email) {
  let client = await pool.connect();
  try {
    return await client.query(
      `SELECT password, isadmin FROM accounts WHERE email = $1`,
      [email]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

async function register(email, password, is_admin = false) {
  let client = await pool.connect();
  try {
    return await client.query(
      `
    INSERT INTO accounts (email, password, isadmin)
        VALUES ($1, $2, $3)
        RETURNING email, isadmin;
    `,
      [email, password, is_admin]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

async function change_password(email, password) {
  let client = await pool.connect();
  try {
    return await client.query(
      `
    UPDATE accounts
      SET password = $1
      WHERE email = $2
      RETURNING email, isadmin;
    `,
      [password, email]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

module.exports = {
  getUserPasswordAndAdminStatus,
  register,
  change_password,
};
