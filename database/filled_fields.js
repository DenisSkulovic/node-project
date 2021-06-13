const { performQuery } = require("./db");

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} filled_field_id
 * @returns {boolean}
 */
async function isPublic_filled_field(filled_field_id) {
  let result = await performQuery(
    `
    SELECT public
    FROM surveys s
    LEFT JOIN filled_surveys fs
    ON fs.survey_id = s.id
    LEFT JOIN filled_fields ff
    ON fs.id = ff.filled_survey_id
    WHERE ff.id = $1;
  `,
    [filled_field_id]
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
 * @param {number} filled_field_id
 * @param {string} email
 * @returns {boolean}
 */
async function isOwner_filled_field(filled_field_id, email) {
  let result = await performQuery(
    `
    SELECT a.email 
    FROM filled_fields ff
    LEFT JOIN filled_surveys fs
    ON ff.filled_survey_id = fs.id
    LEFT JOIN accounts a
    ON a.id = ff.account_id
    WHERE ff.id = $1;
  `,
    [filled_field_id]
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
 * @param {number} filled_field_id
 * @param {string} email
 * @returns {object} query result
 */
async function isSurveyOwner_filled_field(filled_field_id, email) {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = $1`,
    [email]
  );
  account_id = account_id.rows[0]["id"];

  let result = await performQuery(
    `
    SELECT a.email 
    FROM filled_fields ff
    LEFT JOIN filled_surveys fs
    ON ff.filled_survey_id = fs.id
    LEFT JOIN surveys s
    ON s.id = fs.survey_id
    WHERE s.account_id = $1;
  `,
    [account_id]
  );
  if (result.rows[0]["email"]) {
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
 * @param {number} filled_field_id
 * @returns {object} query result
 */
async function get_filled_field_for_filled_field_id(filled_field_id) {
  return await performQuery(
    `
    SELECT * 
    FROM filled_fields
    WHERE id = $1;
  `,
    [filled_field_id]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} filled_survey_id
 * @returns {object} query result
 */
async function get_filled_fields_list_for_filled_survey_id(filled_survey_id) {
  return await performQuery(
    `SELECT *
    FROM filled_fields ff
    LEFT JOIN filled_surveys fs
    ON ff.filled_survey_id = fs.id
    WHERE fs.id = $1;`,
    [filled_survey_id]
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
 * @param {number} filled_survey_id
 * @param {string} answer
 * @returns {object} query result
 */
async function create_filled_field(survey_field_id, filled_survey_id, answer) {
  return await performQuery(
    `INSERT INTO filled_fields (survey_field_id, filled_survey_id, answer)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [survey_field_id, filled_survey_id, answer]
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
 * @param {number} filled_survey_id
 * @param {string} answer
 * @param {number} filled_field_id
 * @returns {object} query result
 */
async function update_filled_field(
  survey_field_id,
  filled_survey_id,
  answer,
  filled_field_id
) {
  return await performQuery(
    `UPDATE survey_fields
    SET survey_field_id = $1
      filled_survey_id = $2
      answer = $3
    WHERE id = $4
    RETURNING *;`,
    [survey_field_id, filled_survey_id, answer, filled_field_id]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} filled_field_id
 * @returns {object} query result
 */
async function delete_filled_field(filled_field_id) {
  return await performQuery(
    `DELETE FROM filled_fields
    WHERE id = $1`,
    [filled_field_id]
  );
}

//
//
//
//
// ###############################################################################
module.exports = {
  isPublic_filled_field,
  isOwner_filled_field,
  isSurveyOwner_filled_field,
  get_filled_field_for_filled_field_id,
  get_filled_fields_list_for_filled_survey_id,
  create_filled_field,
  update_filled_field,
  delete_filled_field,
};
