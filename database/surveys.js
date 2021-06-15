const { performQuery } = require("./db");
const handlePageSize = require("../utils/page_size");

const columns = [
  "id",
  "title",
  "account_id",
  "created_at",
  "modified_at",
  "public",
];

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
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email=:email`,
    { email: email }
  );
  if (account_id.rows.length === 0) {
    return false;
  }
  account_id = account_id.rows[0]["id"];

  let result = await performQuery(
    `
  SELECT a.email
  FROM surveys s
  LEFT JOIN accounts a
  ON a.id = s.account_id
  WHERE s.id = :survey_id
  AND s.account_id = a.id;`,
    { survey_id: survey_id }
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
 * @param {number} survey_id
 * @returns {boolean}
 */
async function isPublic_survey(survey_id) {
  let result = await performQuery(
    `
  SELECT public
  FROM surveys
  WHERE id = :survey_id
  AND public = true;
`,
    { survey_id: survey_id }
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
 * @param {number} survey_id
 * @returns {object} query result
 */
async function get_survey_for_survey_id__public(survey_id) {
  return await performQuery(
    `
  SELECT * 
  FROM surveys s
  WHERE s.id = :survey_id
  AND s.public = true;
`,
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
 * @param {number} survey_id
 * @param {string} email
 * @returns {object} query result
 */
async function get_survey_for_survey_id__public_or_owner(survey_id, email) {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = :email`,
    { email: email }
  );
  if (account_id.rows.length === 0) {
    return account_id;
  }

  account_id = account_id.rows[0]["id"];

  return await performQuery(
    `
  SELECT * 
  FROM surveys s
  WHERE s.id = :survey_id
  AND s.public = true
  OR s.account_id = :account_id;
`,
    { survey_id: survey_id, account_id: account_id }
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
    WHERE id = :survey_id;
  `,
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
 * @param {number} survey_id
 * @param {string} email
 * @returns {object} query result
 */
async function get_survey_for_survey_id__owner(survey_id, email) {
  let account_id = await performQuery(
    `
  SELECT id FROM accounts WHERE email = :email;`,
    { email: email }
  );
  if (account_id.rows.length === 0) {
    return account_id;
  }
  account_id = account_id.rows[0]["id"];
  return await performQuery(
    `
    SELECT *
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE s.id = :survey_id
    AND s.account_id = :account_id;
  `,
    { survey_id: survey_id, account_id: account_id }
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
async function get_survey_list_for_email__all(
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
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = :email
    ORDER BY s.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page_num;`,
    {
      email: email,
      order_by: order_by,
      order: order,
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
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_survey_list_for_email__public_or_owner(
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
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = :email
    OR s.public = true
    ORDER BY s.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page_num;`,
    {
      email: email,
      order_by: order_by,
      order: order,
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
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_survey_list_for_email__owner(
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
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = :email
    ORDER BY s.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page_num;`,
    {
      email: email,
      order_by: order_by,
      order: order,
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
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_survey_list__all(
  order_by = "id",
  page = 1,
  per_page = 10,
  order = "ASC"
) {
  per_page = handlePageSize(per_page, "large");
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT *
    FROM surveys
    ORDER BY ${columns.includes(order_by) ? order_by : "id"}
    ${order.toUpperCase() === "DESC" ? "DESC" : "ASC"}
    OFFSET :offset
    LIMIT :per_page_num;`,
    {
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
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_survey_list__public_or_owner(
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
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = :email
    OR s.public = true
    ORDER BY s.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page_num;`,
    {
      email: email,
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
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_survey_list__owner(
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
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = :email
    ORDER BY s.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page_num;`,
    {
      email: email,
      order_by: order_by,
      order: order,
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
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_survey_list__public(
  order_by = "id",
  page = 1,
  per_page = 10,
  order = "ASC"
) {
  per_page = handlePageSize(per_page, "large");
  let page_num = parseInt(page);
  let per_page_num = parseInt(per_page);
  let offset = page_num * per_page_num - per_page_num;
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE s.public = true
    ORDER BY s.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page_num;`,
    {
      order_by: order_by,
      order: order,
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
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @param {string} order
 * @returns {object} query result
 */
async function get_survey_list_for_email__public(
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
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = :email
    AND s.public = true
    ORDER BY s.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page_num;`,
    {
      email: email,
      order_by: order_by,
      order: order,
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
 * @param {string} email
 * @param {string} survey_title
 * @returns {object} query result
 */
async function create_survey_for_email(email, survey_title) {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = :email;`,
    { email: email }
  );
  account_id = account_id["rows"][0]["id"];

  return await performQuery(
    `INSERT INTO surveys (title, account_id)
        VALUES (:survey_title, :account_id)
        RETURNING *;`,
    { survey_title: survey_title, account_id: account_id }
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
    SET title = :survey_title
        public = :public
    WHERE id = :survey_id
    RETURNING id, title, account_id, created_at, modified_at;`,
    { survey_title: survey_title, public: public, survey_id: survey_id }
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
      WHERE id = :survey_id`,
    { survey_id: survey_id }
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
