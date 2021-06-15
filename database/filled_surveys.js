const { performQuery } = require("./db");
const handlePageSize = require("../utils/page_size");

const columns = ["id", "survey_id", "account_id", "created_at", "modified_at"];

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
    SELECT s.public
    FROM surveys s
    LEFT JOIN filled_surveys fs
    ON fs.survey_id = s.id
    WHERE fs.id = :filled_survey_id
    AND s.public = true;
  `,
    { filled_survey_id: filled_survey_id }
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
 * @param {number} filled_survey_id
 * @param {string} email
 * @returns {object} query result
 */
async function isOwner_filled_survey(filled_survey_id, email) {
  let account_id = await performQuery(
    `
  SELECT id FROM accounts WHERE email = :email`,
    { email: email }
  );
  if (account_id.rows.length === 0) {
    return false;
  }
  account_id = account_id.rows[0]["id"];

  let result = await performQuery(
    `
    SELECT a.email
    FROM filled_surveys fs
    LEFT JOIN accounts a
    ON a.id = fs.account_id
    WHERE fs.id = :filled_survey_id
    AND fs.account_id = :account_id;
  `,
    { filled_survey_id: filled_survey_id, account_id: account_id }
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
 * Check if email is owner of filled survey's original survey.
 * @param {number} filled_survey_id
 * @param {string} email
 * @returns {object} query result
 */
async function isSurveyOwner_filled_survey(filled_survey_id, email) {
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
    FROM filled_surveys fs
    LEFT JOIN surveys s
    ON s.id = fs.survey_id
    LEFT JOIN accounts a
    ON a.id = s.account_id
    WHERE fs.id = :filled_survey_id
    AND s.account_id = :account_id;
  `,
    { filled_survey_id: filled_survey_id, account_id: account_id }
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
 * @param {number} filled_survey_id
 * @returns {object} query result
 */
async function get_filled_survey_for_filled_survey_id(filled_survey_id) {
  return await performQuery(
    `SELECT * 
    FROM filled_surveys
    WHERE id = :filled_survey_id;`,
    { filled_survey_id: filled_survey_id }
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
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns
 */
async function get_filled_survey_list_for_email__all(
  email,
  order_by = "id",
  page = 1,
  per_page = 10,
  order = "ASC"
) {
  per_page = handlePageSize(per_page, "large");
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = :email;`,
    { email: email }
  );
  if (account_id.rows.length === 0) {
    return account_id;
  }
  account_id = account_id.rows[0]["id"];

  return await performQuery(
    `
    SELECT fs.* 
    FROM filled_surveys fs
    LEFT JOIN accounts a
    ON a.id = fs.account_id
    WHERE a.id = :account_id
    ORDER BY ${columns.includes(order_by) ? order_by : "id"}    
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page;
  `,
    {
      account_id: account_id,
      order_by: order_by,
      order: order,
      offset: offset,
      per_page: per_page,
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
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_filled_survey_list_for_email__filledSurveyOwner(
  email,
  order_by = "id",
  page = 1,
  per_page = 10,
  order = "ASC"
) {
  per_page = handlePageSize(per_page, "large");
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = :email;`,
    { email: email }
  );
  if (account_id.rows.length === 0) {
    return account_id;
  }
  account_id = account_id.rows[0]["id"];

  return await performQuery(
    `
    SELECT fs.* 
    FROM filled_surveys fs
    WHERE fs.account_id = :account_id
    ORDER BY ${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page;
  `,
    {
      account_id: account_id,
      order_by: order_by,
      order: order,
      offset: offset,
      per_page: per_page,
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
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_filled_survey_list_for_email__surveyOwner(
  email,
  order_by = "id",
  page = 1,
  per_page = 10,
  order = "ASC"
) {
  per_page = handlePageSize(per_page, "large");
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = :email;`,
    { email: email }
  );
  if (account_id.rows.length === 0) {
    return account_id;
  }
  account_id = account_id.rows[0]["id"];

  return await performQuery(
    `
    SELECT fs.* 
    FROM filled_surveys fs
    LEFT JOIN survey s
    ON s.id = fs.survey_id
    WHERE s.account_id = :account_id
    ORDER BY ${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page;
  `,
    {
      account_id: account_id,
      order_by: order_by,
      order: order,
      offset: offset,
      per_page: per_page,
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
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_filled_survey_list_for_email__public(
  email,
  order_by = "id",
  page = 1,
  per_page = 10,
  order = "ASC"
) {
  per_page = handlePageSize(per_page, "large");
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = :email;`,
    { email: email }
  );
  if (account_id.rows.length === 0) {
    return account_id;
  }
  account_id = account_id.rows[0]["id"];

  return await performQuery(
    `
    SELECT fs.* 
    FROM filled_surveys fs
    LEFT JOIN survey s
    ON s.id = fs.survey_id
    WHERE s.public = true
    AND s.fs.account_id = :account_id
    ORDER BY ${columns.includes(order_by) ? order_by : "id"}\
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page;
  `,
    {
      account_id: account_id,
      order_by: order_by,
      order: order,
      offset: offset,
      per_page: per_page,
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
 * @param {number} survey_id
 * @param {string} email
 * @returns {object} query result
 */
async function create_filled_survey_for_survey_id(survey_id, email) {
  if (email) {
    let account_id = await performQuery(
      `SELECT id FROM accounts WHERE email = :email;`,
      { email: email }
    );
    if (account_id.rows.length === 0) {
      return account_id;
    }
    account_id = account_id.rows[0]["id"];

    return await performQuery(
      `INSERT INTO filled_surveys (survey_id, account_id)
    VALUES (:survey_id, :account_id)
    RETURNING *;`,
      { survey_id: survey_id, account_id: account_id }
    );
  }
  return await performQuery(
    `INSERT INTO filled_surveys (survey_id)
        VALUES (:survey_id)
        RETURNING *;`,
    { survey_id: survey_id }
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
    WHERE id = :filled_survey_id`,
    { filled_survey_id: filled_survey_id }
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
