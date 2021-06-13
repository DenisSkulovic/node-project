const { performQuery } = require("./db");

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} survey_field_id
 * @returns {boolean}
 */
async function isPublic_survey_field(survey_field_id) {
  let result = await performQuery(
    `
      SELECT public
      FROM surveys s
      LEFT JOIN survey_fields sf
      ON sf.survey_id = s.id
      WHERE sf.id = $1
      AND s.public = true;
    `,
    [survey_field_id]
  );
  if (result.rows[0]["public"] === true) {
    return true;
  }
  return false;
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} survey_field_id
 * @param {string} email
 * @returns {boolean}
 */
async function isOwner_survey_field(survey_field_id, email) {
  let result = await performQuery(
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
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} survey_field_id
 * @returns {object} query result
 */
async function get_survey_field_for_survey_field_id(survey_field_id) {
  return await performQuery(
    `
    SELECT * 
    FROM survey_fields
    WHERE id = $1;
  `,
    [survey_field_id]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} survey_id
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query result
 */
async function get_survey_fields_list_for_survey_id__all(
  survey_id,
  order_by = "title",
  page = 1,
  per_page = 10
) {
  return await performQuery(
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
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} survey_id
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query result
 */
async function get_survey_fields_list_for_survey_id__public(
  survey_id,
  order_by = "title",
  page = 1,
  per_page = 10
) {
  return await performQuery(
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
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} field_type_id
 * @param {number} survey_id
 * @param {string} title
 * @returns {object} query result
 */
async function create_survey_field(field_type_id, survey_id, title) {
  return await performQuery(
    `INSERT INTO survey_fields (field_type_id, survey_id, title)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [field_type_id, survey_id, title]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} survey_field_id
 * @param {string} survey_field_title
 * @param {number} survey_field_type_id
 * @returns {object} query result
 */
async function update_survey_field(
  survey_field_id,
  survey_field_title,
  survey_field_type_id
) {
  return await performQuery(
    `UPDATE survey_fields
    SET title = $1
        survey_type_id = $2
    WHERE id = $3
    RETURNING *;`,
    [survey_field_title, survey_field_type_id, survey_field_id]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} survey_field_id
 * @returns {object} query result
 */
async function delete_survey_field(survey_field_id) {
  return await performQuery(
    `DELETE FROM survey_fields
    WHERE id = $1`,
    [survey_field_id]
  );
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
