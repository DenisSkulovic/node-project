const pool = require("./db");

//
// ###############################################################################
/**
 * isPublic_survey_field
 * @param {number} survey_id
 * @returns {boolean}
 */
async function isPublic_survey_field(survey_field_id) {
  let client = await pool.connect();
  try {
    let result = await client.query(
      `
      SELECT public
      FROM surveys s
      LEFT JOIN survey_fields sf
      ON sf.survey_id = s.id
      WHERE sf.id = $1;
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
 * isOwner_survey_field
 * @param {number} survey_field_id
 * @returns {boolean}
 */
async function isOwner_survey_field(survey_field_id, email) {
  let client = await pool.connect();
  try {
    let result = await client.query(
      `
      SELECT a.email
      FROM survey_fields sf
      LEFT JOIN surveys s
      ON s.id = sf.survey_id
      LEFT JOIN accounts a
      ON a.id = s.account_id
      WHERE sf.id = $1;
    `,
      [survey_field_id]
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
 * get_survey_field_for_survey_field_id
 * @param {number} survey_field_id
 * @returns {object} query results
 */
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
/**
 * get_survey_fields_list_for_survey_id__all
 * @param {number} survey_id
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query results
 */
async function get_survey_fields_list_for_survey_id__all(
  survey_id,
  order_by = "title",
  page = 1,
  per_page = 10
) {
  let client = await pool.connect();
  try {
    return await client.query(
      `SELECT *
      FROM survey_fields sf
      LEFT JOIN survey s
      ON s.id = sf.survey_id
      WHERE s.id = $1
      ORDER BY $2
      DESC
      OFFSET $3
      LIMIT $4;`,
      [survey_id, order_by, page, per_page]
    );
  } catch (error) {
    console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
/**
 * get_survey_fields_list_for_survey_id__public
 * @param {number} survey_id
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query results
 */
async function get_survey_fields_list_for_survey_id__public(
  survey_id,
  order_by = "title",
  page = 1,
  per_page = 10
) {
  let client = await pool.connect();
  try {
    return await client.query(
      `SELECT *
      FROM survey_fields sf
      LEFT JOIN survey s
      ON s.id = sf.survey_id
      WHERE s.id = $1
      AND s.public = true
      ORDER BY $2
      DESC
      OFFSET $3
      LIMIT $4;`,
      [survey_id, order_by, page, per_page]
    );
  } catch (error) {
    console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
/**
 * create_survey_field
 * @param {number} field_type_id
 * @param {number} survey_id
 * @param {string} title
 * @returns {object} query results
 */
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
/**
 * update_survey_field
 * @param {number} survey_field_id
 * @param {number} survey_field_title
 * @param {number} survey_field_type_id
 * @returns {object} query results
 */
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
/**
 * delete_survey_field
 * @param {number} survey_field_id
 * @returns {object} query results
 */
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
  isPublic_survey_field,
  isOwner_survey_field,
  get_survey_field_for_survey_field_id,
  get_survey_fields_list_for_survey_id__all,
  get_survey_fields_list_for_survey_id__public,
  create_survey_field,
  update_survey_field,
  delete_survey_field,
};
