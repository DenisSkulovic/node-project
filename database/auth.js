const { performQuery } = require("./db");

/**
 * Retrieve user password and admin status.
 * @param {string} email
 * @returns {object} query result
 */
async function getUserPasswordAndAdminStatus(email) {
  return await performQuery(
    `SELECT password, isadmin FROM accounts WHERE email = :email`,
    { email: email }
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
        VALUES (:email, :password, :is_admin)
        RETURNING email, isadmin;
    `,
    { email: email, password: password, is_admin: is_admin }
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
      SET password = :password
      WHERE email = :email
      RETURNING email, isadmin;
    `,
    { password: password, email: email }
  );
}

module.exports = {
  getUserPasswordAndAdminStatus,
  register,
  change_password,
};
