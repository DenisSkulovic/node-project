const { performQuery } = require("./db");

/**
 * Retrieve user password and admin status.
 * @param {string} email
 * @returns {object} query result
 */
async function getUserPasswordAndAdminStatus(email) {
  return await performQuery(
    `SELECT password, isadmin FROM accounts WHERE email = $1`,
    [email]
  );
}

/**
 * Insert new user into "accounts" table.
 * @param {string} email
 * @param {string | number} password
 * @param {boolean} is_admin
 * @returns {object} query result
 */
async function register(email, password, is_admin = false) {
  return await performQuery(
    `
    INSERT INTO accounts (email, password, isadmin)
        VALUES ($1, $2, $3)
        RETURNING email, isadmin;
    `,
    [email, password, is_admin]
  );
}

/**
 * Change password for user in "accounts" table
 * @param {string} email
 * @param {string | number} password
 * @returns {object} query result
 */
async function change_password(email, password) {
  return await performQuery(
    `
    UPDATE accounts
      SET password = $1
      WHERE email = $2
      RETURNING email, isadmin;
    `,
    [password, email]
  );
}

module.exports = {
  getUserPasswordAndAdminStatus,
  register,
  change_password,
};
