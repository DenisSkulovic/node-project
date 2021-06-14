const { Pool } = require("pg");
const named = require("yesql").pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
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
 * @param {string} query Query string with values specified for parametrization.
 * @param {object} kwargs An object with values to parametrise the query with.
 * @returns {object} query result
 */
async function performQuery(query, kwargs) {
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

//
//
//
//
// #################################################################################
module.exports = { pool, performQuery };
