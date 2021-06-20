import { performQuery } from "./db";

//
//
//
//
// ###############################################################################
/**
 * Retrieve user password and admin status.
 */
// -------------------------------------------------------------------------------
export const getUserPasswordAndAdminStatus = async (email: string) => {
  return await performQuery(
    `SELECT password, isadmin FROM accounts WHERE email = :email`,
    { email: email });
}

//
//
//
//
// ###############################################################################
/**
 * Insert new user into "accounts" table.
 */
// -------------------------------------------------------------------------------
export const register = async (email: string, password: string, is_admin = false) => {
  return await performQuery(
    `
    INSERT INTO accounts (email, password, isadmin)
        VALUES (:email, :password, :is_admin)
        RETURNING email, isadmin;
    `,
    {
      email: email,
      password: password,
      is_admin: is_admin
    }
  );
}

//
//
//
//
// ###############################################################################
/**
 * Change password for user in "accounts" table
 */
// -------------------------------------------------------------------------------
export const change_password = async (email: string, password: string) => {
  return await performQuery(
    `
    UPDATE accounts
      SET password = :password
      WHERE email = :email
      RETURNING email, isadmin;
    `,
    new Map([["password", password], ["email", email]])

  );
}
