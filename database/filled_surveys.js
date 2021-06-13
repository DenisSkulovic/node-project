const { performQuery } = require("./db");

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
async function isPublic_filled_survey(filled_survey_id) {
  let result = await performQuery(
    `
    SELECT public
    FROM surveys s
    LEFT JOIN filled_surveys fs
    ON fs.survey_id = s.id
    WHERE fs.id = $1;
  `,
    [filled_survey_id]
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
 * @param {number} filled_survey_id
 * @param {string} email
 * @returns {object} query result
 */
async function isOwner_filled_survey(filled_survey_id, email) {
  let result = await performQuery(
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
}

//
//
//
//
// ###############################################################################
/**
 * Check if email is owner of filled survey's original survey.
 * @param {number} filled_survey_id
 * @param {string} email
 * @returns {object} query result
 */
async function isSurveyOwner_filled_survey(filled_survey_id, email) {
  let result = await performQuery(
    `
    SELECT a.email
    FROM filled_surveys fs
    LEFT JOIN surveys s
    ON s.id = fs.survey_id
    LEFT JOIN accounts a
    ON a.id = s.account_id
    WHERE fs.id = $1
    AND a.email = 
  `,
    [filled_survey_id, email]
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
 * @param {number} filled_survey_id
 * @returns {object} query result
 */
async function get_filled_survey_for_filled_survey_id(filled_survey_id) {
  return await performQuery(
    `SELECT * 
    FROM filled_surveys
    WHERE id = $1;`,
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
 * @param {string} email
 * @returns {object} query result
 */
async function get_filled_survey_list_for_email__all(email) {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = $1;`,
    [email]
  );
  account_id = account_id.rows[0]["id"];

  return await performQuery(
    `
    SELECT fs.* 
    FROM filled_surveys fs
    LEFT JOIN accounts a
    ON a.id = fs.account_id
    WHERE a.id = $1;
  `,
    [account_id]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {string} email
 * @returns {object} query result
 */
async function get_filled_survey_list_for_email__filledSurveyOwner(email) {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = $1;`,
    [email]
  );
  account_id = account_id.rows[0]["id"];

  return await performQuery(
    `
    SELECT fs.* 
    FROM filled_surveys fs
    WHERE fs.account_id = $1;
  `,
    [account_id]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {string} email
 * @returns {object} query result
 */
async function get_filled_survey_list_for_email__surveyOwner(email) {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = $1;`,
    [email]
  );
  account_id = account_id.rows[0]["id"];

  return await performQuery(
    `
    SELECT fs.* 
    FROM filled_surveys fs
    LEFT JOIN survey s
    ON s.id = fs.survey_id
    WHERE s.account_id = $1;
  `,
    [account_id]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {string} email
 * @returns {object} query result
 */
async function get_filled_survey_list_for_email__public(email) {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = $1;`,
    [email]
  );
  account_id = account_id.rows[0]["id"];

  return await performQuery(
    `
    SELECT fs.* 
    FROM filled_surveys fs
    LEFT JOIN survey s
    ON s.id = fs.survey_id
    WHERE s.public = true
    AND s.fs.account_id = $1;
  `,
    [account_id]
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
 * @param {string} email
 * @returns {object} query result
 */
async function create_filled_survey_for_survey_id(survey_id, email) {
  if (email) {
    let account_id = await performQuery(
      `SELECT id FROM accounts WHERE email = $1;`,
      [email]
    );
    account_id = account_id.rows[0]["id"];
    return await performQuery(
      `INSERT INTO filled_surveys (survey_id, account_id)
    VALUES ($1, $2)
    RETURNING *;`,
      [survey_id, account_id]
    );
  }
  return await performQuery(
    `INSERT INTO filled_surveys (survey_id)
        VALUES ($1)
        RETURNING *;`,
    [survey_id]
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
async function delete_filled_survey(filled_survey_id) {
  return await performQuery(
    `DELETE FROM filled_surveys
    WHERE id = $1`,
    [filled_survey_id]
  );
}

//
//
//
//
// ###############################################################################
module.exports = {
  isPublic_filled_survey,
  isOwner_filled_survey,
  isSurveyOwner_filled_survey,
  get_filled_survey_for_filled_survey_id,
  get_filled_survey_list_for_email__all,
  get_filled_survey_list_for_email__filledSurveyOwner,
  get_filled_survey_list_for_email__surveyOwner,
  get_filled_survey_list_for_email__public,
  create_filled_survey_for_survey_id,
  delete_filled_survey,
};
