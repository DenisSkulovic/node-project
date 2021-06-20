import { performQuery } from "./db";

//
//
//
//
// ##################################################################################################
/**
 * Retrieve user data without password.
 */
// -------------------------------------------------------------------------------
export const get_account_passwordless = async (email: string) => {
  return await performQuery(
    `SELECT id, email, is_admin, created_at, modified_at 
    FROM accounts 
    WHERE email = :email;`,
    { email: email }
  );
}

//
//
//
//
// ##################################################################################################
/**
 * Retrieve user data including password (UNSAFE)
 */
// -------------------------------------------------------------------------------
export const get_account_full = async (email: string) => {
  return await performQuery(
    `SELECT * 
    FROM accounts 
    WHERE email = :email;`,
    { email: email }
  );
}
