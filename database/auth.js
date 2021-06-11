const pool = require("./db");

async function getDataForLogin(email) {
  let client = await pool.connect();
  try {
    return await client.query(
      `SELECT email, password FROM accounts WHERE email = $1`,
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
    return await client.query(``, []);
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

async function change_password() {
  let client = await pool.connect();
  try {
    return await client.query(``, []);
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

module.exports = {
  getDataForLogin,
  register,
  change_password,
};
