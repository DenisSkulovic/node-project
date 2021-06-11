const pool = require("./db");

async function get_account_passwordless(email) {
  let client = await pool.connect();
  try {
    let result = await client.query(
      `SELECT id, email, created_at, is_admin, modified_at 
        FROM accounts 
        WHERE email = $1;`,
      [email]
    );
    console.log("Query successful.");
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

async function get_account_full(email) {
  let client = await pool.connect();
  try {
    let result = await client.query(
      `SELECT * FROM accounts WHERE email = $1;`,
      [email]
    );
    console.log("Query successful.");
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

async function login() {
  let client = await pool.connect();
  try {
    await client.query(``, []);
    console.log("Query successful.");
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

async function register(email, password, is_admin = false) {
  let client = await pool.connect();
  try {
    await client.query(``, []);
    console.log("Query successful.");
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

async function change_password() {
  let client = await pool.connect();
  try {
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

module.exports = {
  get_account_passwordless,
  get_account_full,
  login,
  register,
  change_password,
};
