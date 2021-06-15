const { performQuery } = require("./db");

const columns = [
  "id",
  "survey_field_id",
  "filled_survey_id",
  "answer",
  "created_at",
  "modified_at",
];

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
    SELECT s.public
    FROM surveys s
    LEFT JOIN filled_surveys fs
    ON fs.survey_id = s.id
    LEFT JOIN filled_fields ff
    ON fs.id = ff.filled_survey_id
    WHERE ff.id = :filled_field_id
    AND s.public = true;
  `,
    { filled_field_id: filled_field_id }
  );
  if (result.rows.length > 0) {
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
  let account_id = await performQuery(
    `
  SELECT id FROM accounts WHERE email = :email;`,
    { email: email }
  );
  if (account_id.rows.length === 0) {
    return false;
  }
  account_id = account_id.rows[0]["id"];

  let result = await performQuery(
    `
    SELECT a.email 
    FROM filled_fields ff
    LEFT JOIN filled_surveys fs
    ON ff.filled_survey_id = fs.id
    LEFT JOIN accounts a
    ON a.id = ff.account_id
    WHERE ff.id = :filled_field_id
    AND fs.account_id = :account_id;
  `,
    { filled_field_id: filled_field_id, account_id: account_id }
  );
  if (result.rows.length > 0) {
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
    `SELECT id FROM accounts WHERE email = :email`,
    { email: email }
  );
  if (account_id.rows.length === 0) {
    return false;
  }
  account_id = account_id.rows[0]["id"];

  let result = await performQuery(
    `
    SELECT a.email 
    FROM filled_fields ff
    LEFT JOIN filled_surveys fs
    ON ff.filled_survey_id = fs.id
    LEFT JOIN surveys s
    ON s.id = fs.survey_id
    WHERE ff.id = :filled_field_id
    AND s.account_id = :account_id;
  `,
    { filled_field_id: filled_field_id, account_id: account_id }
  );
  if (result.rows.length > 0) {
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
    WHERE id = :filled_field_id;
  `,
    { filled_field_id: filled_field_id }
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
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_filled_fields_list_for_filled_survey_id(
  filled_survey_id,
  order_by = "id",
  page = 1,
  per_page = 10,
  order = "ASC"
) {
  per_page = per_page > 100 ? 100 : per_page;
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT ff.*
    FROM filled_fields ff
    LEFT JOIN filled_surveys fs
    ON ff.filled_survey_id = fs.id
    WHERE fs.id = :filled_survey_id
    ORDER BY ff.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page_num;`,
    {
      filled_survey_id: filled_survey_id,
      order: order,
      order_by: order_by,
      offset: offset,
      per_page_num: per_page_num,
    }
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
    VALUES (:survey_field_id, :filled_survey_id, :answer)
    RETURNING *;`,
    {
      survey_field_id: survey_field_id,
      filled_survey_id: filled_survey_id,
      answer: answer,
    }
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
    SET survey_field_id = :survey_field_id
      filled_survey_id = :filled_survey_id
      answer = :answer
    WHERE id = :filled_field_id
    RETURNING *;`,
    {
      survey_field_id: survey_field_id,
      filled_survey_id: filled_survey_id,
      answer: answer,
      filled_field_id: filled_field_id,
    }
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
    WHERE id = :filled_field_id`,
    { filled_field_id: filled_field_id }
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
