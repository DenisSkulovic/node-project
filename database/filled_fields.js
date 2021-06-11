const pool = require("./db");

//
// ###############################################################################
async function get_filled_field_for_filled_field_id(filled_field_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `
      SELECT * 
      FROM filled_fields
      WHERE id = $1;
    `,
      [filled_field_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function get_filled_fields_list_for_filled_survey_id(filled_survey_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `SELECT *
      FROM filled_fields ff
      LEFT JOIN filled_surveys fs
      ON ff.filled_survey_id = fs.id
      WHERE fs.id = $1;`,
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
async function create_filled_field(survey_field_id, filled_survey_id, answer) {
  let client = await pool.connect();
  try {
    // create survey_fields table entry
    return await client.query(
      `INSERT INTO filled_fields (survey_field_id, filled_survey_id, answer)
        VALUES ($1, $2, $3)
        RETURNING *;`,
      [survey_field_id, filled_survey_id, answer]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function update_filled_field(
  survey_field_id,
  filled_survey_id,
  answer,
  filled_field_id
) {
  let client = await pool.connect();
  try {
    return await client.query(
      `UPDATE survey_fields
      SET survey_field_id = $1
        filled_survey_id = $2
        answer = $3
      WHERE id = $4
      RETURNING *;`,
      [survey_field_id, filled_survey_id, answer, filled_field_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function delete_filled_field(filled_field_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `DELETE FROM filled_fields
      WHERE id = $1`,
      [filled_field_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

module.exports = {
  get_filled_field_for_filled_field_id,
  get_filled_fields_list_for_filled_survey_id,
  create_filled_field,
  update_filled_field,
  delete_filled_field,
};
