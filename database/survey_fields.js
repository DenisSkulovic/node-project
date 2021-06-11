const pool = require("./db");

//
// ###############################################################################
async function get_survey_field_for_survey_field_id(survey_field_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `
      SELECT * 
      FROM survey_fields
      WHERE id = $1;
    `,
      [survey_field_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function get_survey_fields_list_for_survey_id(survey_id) {
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
    console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function create_survey_field(field_type_id, survey_id, title) {
  let client = await pool.connect();
  try {
    // create survey_fields table entry
    return await client.query(
      `INSERT INTO survey_fields (field_type_id, survey_id, title)
        VALUES ($1, $2, $3)
        RETURNING *;`,
      [field_type_id, survey_id, title]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function update_survey_field(
  survey_field_id,
  survey_field_title,
  survey_field_type_id
) {
  let client = await pool.connect();
  try {
    return await client.query(
      `UPDATE survey_fields
      SET title = $1
          survey_type_id = $2
      WHERE id = $3
      RETURNING *;`,
      [survey_field_title, survey_field_type_id, survey_field_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function delete_survey_field(survey_field_id) {
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
  get_survey_field_for_survey_field_id,
  get_survey_fields_list_for_survey_id,
  create_survey_field,
  update_survey_field,
  delete_survey_field,
};
