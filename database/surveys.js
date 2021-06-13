const { performQuery } = require("./db");

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} survey_id
 * @param {string} email
 * @returns {boolean}
 */
async function isOwner_survey(survey_id, email) {
  let result = await performQuery(
    `
  SELECT a.email
  FROM surveys s
  LEFT JOIN accounts a
  ON a.id = s.account_id
  WHERE sf.id = $1;`,
    [survey_id, email]
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
 * @param {number} survey_id
 * @returns {boolean}
 */
async function isPublic_survey(survey_id) {
  let result = await performQuery(
    `
  SELECT public
  FROM surveys s
  WHERE s.id = $1;
`,
    [survey_id]
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
 * @param {number} survey_id
 * @returns {object} query result
 */
async function get_survey_for_survey_id__public(survey_id) {
  return await performQuery(
    `
  SELECT * 
  FROM surveys s
  WHERE s.id = $1
  AND s.public = true;
`,
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
 * @param {number} survey_id
 * @param {string} email
 * @returns {object} query result
 */
async function get_survey_for_survey_id__public_or_owner(survey_id, email) {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = $1`,
    [email]
  );

  return await performQuery(
    `
  SELECT * 
  FROM surveys s
  WHERE s.id = $1
  AND s.public = true
  OR s.account_id = $2;
`,
    [survey_id, account_id]
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
 * @returns {object} query result
 */
async function get_survey_for_survey_id__all(survey_id) {
  return await performQuery(
    `
    SELECT *
    FROM surveys 
    WHERE id = $1;
  `,
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
 * @param {number} survey_id
 * @param {string} email
 * @returns {object} query result
 */
async function get_survey_for_survey_id__owner(survey_id, email) {
  return await performQuery(
    `
    SELECT *
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE s.id = $1
    AND a.email = $2;
  `,
    [survey_id, email]
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
 * @returns {object} query result
 */
async function get_survey_list_for_email__all(
  email,
  order_by = "id",
  page = 1,
  per_page = 10
) {
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = $1
    ORDER BY s.$2
    DESC
    OFFSET $3
    LIMIT $4;`,
    [email, order_by, offset, per_page_num]
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
 * @returns {object} query result
 */
async function get_survey_list_for_email__public_or_owner(
  email,
  order_by = "id",
  page = 1,
  per_page = 10
) {
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = $1
    OR s.public = true
    ORDER BY s.$2
    DESC
    OFFSET $3
    LIMIT $4;`,
    [email, order_by, offset, per_page_num]
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
 * @returns {object} query result
 */
async function get_survey_list_for_email__owner(
  email,
  order_by = "id",
  page = 1,
  per_page = 10
) {
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = $1
    ORDER BY s.$2
    DESC
    OFFSET $3
    LIMIT $4;`,
    [email, order_by, offset, per_page_num]
  );
}
//
//
//
//
// ###############################################################################
/**
 *
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query result
 */
async function get_survey_list__all(order_by = "id", page = 1, per_page = 10) {
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    ORDER BY $1
    DESC
    OFFSET $2
    LIMIT $3;`,
    [order_by, offset, per_page_num]
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
 * @returns {object} query result
 */
async function get_survey_list__public_or_owner(
  email,
  order_by = "id",
  page = 1,
  per_page = 10
) {
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = $1
    OR s.public = true
    ORDER BY s.$2
    DESC
    OFFSET $3
    LIMIT $4;`,
    [email, order_by, offset, per_page_num]
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
 * @returns {object} query result
 */
async function get_survey_list__owner(
  email,
  order_by = "id",
  page = 1,
  per_page = 10
) {
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = $1
    ORDER BY s.$2
    DESC
    OFFSET $3
    LIMIT $4;`,
    [email, order_by, offset, per_page_num]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query result
 */
async function get_survey_list__public(
  order_by = "id",
  page = 1,
  per_page = 10
) {
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE s.public = true
    ORDER BY s.$1
    DESC
    OFFSET $2
    LIMIT $3;`,
    [order_by, offset, per_page_num]
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
 * @returns {object} query result
 */
async function get_survey_list_for_email__public(
  email,
  order_by = "id",
  page = 1,
  per_page = 10
) {
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = $1
    AND s.public = true
    ORDER BY s.$2
    DESC
    OFFSET $3
    LIMIT $4;`,
    [email, order_by, offset, per_page_num]
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
 * @param {string} survey_title
 * @returns {object} query result
 */
async function create_survey_for_email(email, survey_title) {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = $1;`,
    [email]
  );
  account_id = account_id["rows"][0]["id"];

  return await performQuery(
    `INSERT INTO surveys (title, account_id)
        VALUES ($1, $2)
        RETURNING *;`,
    [survey_title, account_id]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {string} survey_title
 * @param {boolean} public
 * @param {number} survey_id
 * @returns {object} query result
 */
async function update_survey_for_survey_id(survey_title, public, survey_id) {
  if (!survey_title || !public || !survey_id) {
    return console.log("Not all data provided.");
  }
  return await performQuery(
    `UPDATE surveys
    SET title = $1
        public = $2
    WHERE id = $3
    RETURNING id, title, account_id, created_at, modified_at;`,
    [survey_title, public, survey_id]
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
 * @returns {object} query result
 */
async function delete_survey_by_survey_id(survey_id) {
  return await performQuery(
    `DELETE FROM surveys
      WHERE id = $1`,
    [survey_id]
  );
}

//
//
//
// ###############################################################################
module.exports = {
  isOwner_survey,
  isPublic_survey,
  get_survey_for_survey_id__all,
  get_survey_for_survey_id__public,
  get_survey_for_survey_id__public_or_owner,
  get_survey_for_survey_id__owner,
  get_survey_list_for_email__all,
  get_survey_list_for_email__public,
  get_survey_list_for_email__public_or_owner,
  get_survey_list_for_email__owner,
  get_survey_list__all,
  get_survey_list__public,
  get_survey_list__public_or_owner,
  get_survey_list__owner,
  create_survey_for_email,
  update_survey_for_survey_id,
  delete_survey_by_survey_id,
};
