const { Pool } = require("pg");

// ###################################################
// move the credentials into ENV
// ###################################################

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "survey_db",
  password: "postgres",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ###################################################
// move the credentials into ENV
// ###################################################

module.exports = pool;
