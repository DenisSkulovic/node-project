const { performQuery } = require("./db");

/**
 * Retrieve user data without password.
 * @param {string} email
 * @returns {object} query result
 */
async function get_account_passwordless(email) {
  return await performQuery(
    `SELECT id, email, is_admin, created_at, modified_at 
        FROM accounts 
        WHERE email = $1;`,
    [email]
  );
}

/**
 * Retrieve user data including password (UNSAFE)
 * @param {string} email
 * @returns {object} query result
 */
async function get_account_full(email) {
  return await performQuery(`SELECT * FROM accounts WHERE email = $1;`, [
    email,
  ]);
}

module.exports = {
  get_account_passwordless,
  get_account_full,
};
