import { Pool } from "pg";
import { LooseObject } from "types";
const named = require("yesql").pg;

const pool = new Pool({
  user: process.env["DB_USER"]!,
  host: process.env["DB_HOST"]!,
  database: process.env["DB_DATABASE"]!,
  password: process.env["DB_PASSWORD"]!,
  port: parseInt(process.env["DB_PORT"]!),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

//
//
//
//
// #################################################################################
/**
 * Perform Postgres Query.
 * Creates a Postgres client, safely performs query and releases the client.
 */
// -------------------------------------------------------------------------------
export const performQuery = async (query: string, kwargs: LooseObject) => {
  console.log("query", query);
  let client = await pool.connect();
  try {
    return await client.query(named(query)(kwargs));
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}
