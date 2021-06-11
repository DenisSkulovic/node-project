const pool = require("./db");

//
// ###############################################################################
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
async function get_filled_survey_list_for_email(email) {
  let client = await pool.connect();
  try {
    return await client.query(
      `
      SELECT *
      FROM survey_fields sf
      LEFT JOIN survey s
      ON s.id = sf.survey_id
      WHERE s.id = $1;
    `,
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
  get_filled_survey_for_filled_survey_id,
  get_filled_survey_list_for_email,
  create_filled_survey_for_survey_id,
  delete_filled_survey,
};
