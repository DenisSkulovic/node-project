const pool = require("./db");

//
// ###############################################################################
/**
 * isPublic_filled_survey
 * @param {number} survey_id
 * @returns {boolean}
 */
async function isPublic_filled_survey(filled_survey_id) {
  let client = await pool.connect();
  try {
    let result = await client.query(
      `
      SELECT public
      FROM surveys s
      LEFT JOIN filled_surveys fs
      ON fs.survey_id = s.id
      WHERE fs.id = $1;
    `,
      [survey_id]
    );
    if (result.rows[0]["public"] === true) {
      return true;
    }
    return false;
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
/**
 * isOwner_filled_survey
 * @param {number} filled_survey_id
 * @returns {boolean}
 */
async function isOwner_filled_survey(filled_survey_id, email) {
  let client = await pool.connect();
  try {
    let result = await client.query(
      `
      SELECT a.email
      FROM filled_surveys fs
      LEFT JOIN accounts a
      ON a.id = fs.account_id
      WHERE fs.id = $1;
    `,
      [filled_survey_id]
    );
    if (result.rows[0]["email"] == email) {
      return true;
    }
    return false;
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
/**
 * get_filled_survey_for_filled_survey_id
 * @param {number} filled_survey_id
 * @returns {object} query results
 */
async function get_filled_survey_for_filled_survey_id(filled_survey_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `SELECT * 
      FROM filled_surveys
      WHERE id = $1;`,
      [filled_survey_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
/**
 * get_filled_survey_list_for_email
 * @param {number} survey_field_id
 * @returns {object} query results
 */
async function get_filled_survey_list_for_email(email) {
  let client = await pool.connect();
  try {
    return await client.query(
      `
      SELECT fs.* 
      FROM filled_surveys fs
      LEFT JOIN survey s
      ON s.id = fs.survey_id
      LEFT JOIN accounts a
      ON a.id = s.account_id
      WHERE a.id = $1;
    `,
      [email]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
/**
 * delete_survey_field
 * @param {number} survey_field_id
 * @returns {object} query results
 */
async function create_filled_survey_for_survey_id(survey_id) {
  let client = await pool.connect();
  try {
    // create survey_fields table entry
    return await client.query(
      `INSERT INTO filled_surveys (survey_id)
        VALUES ($1)
        RETURNING *;`,
      [survey_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
/**
 * delete_survey_field
 * @param {number} survey_field_id
 * @returns {object} query results
 */
async function delete_filled_survey(filled_survey_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `DELETE FROM survey_fields
      WHERE id = $1`,
      [survey_field_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

module.exports = {
  isPublic_filled_survey,
  isOwner_filled_survey,
  get_filled_survey_for_filled_survey_id,
  get_filled_survey_list_for_email,
  create_filled_survey_for_survey_id,
  delete_filled_survey,
};
