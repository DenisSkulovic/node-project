const { Pool } = require("pg");

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

// #################################################################################
/**
 * Perform Postgres Query.
 * Creates a Postgres client, safely performs query and releases the client.
 * @param {string} query Query string with values specified for parametrization.
 * @param {array} args An array with values to parametrise the query with.
 * @returns {object} query result
 */
async function performQuery(query, args) {
  let client = await pool.connect();
  try {
    return await client.query(query, args);
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

module.exports = { pool, performQuery };
