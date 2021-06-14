const { performQuery } = require("./db");

const columns = [
  "id",
  "field_type_id",
  "survey_id",
  "title",
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
      WHERE sf.id = :survey_field_id
      AND s.public = true;
    `,
    { survey_field_id: survey_field_id }
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
 * @param {number} survey_field_id
 * @param {string} email
 * @returns {boolean}
 */
async function isOwner_survey_field(survey_field_id, email) {
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
    FROM survey_fields sf
    LEFT JOIN surveys s
    ON s.id = sf.survey_id
    LEFT JOIN accounts a
    ON a.id = s.account_id
    WHERE sf.id = :survey_field_id
    AND s.account_id = :account_id;
  `,
    { survey_field_id: survey_field_id, account_id: account_id }
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
 * @param {number} survey_field_id
 * @returns {object} query result
 */
async function get_survey_field_for_survey_field_id(survey_field_id) {
  return await performQuery(
    `
    SELECT * 
    FROM survey_fields
    WHERE id = :survey_field_id;
  `,
    { survey_field_id: survey_field_id }
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
    `SELECT sf.*
    FROM survey_fields sf
    LEFT JOIN survey s
    ON s.id = sf.survey_id
    WHERE s.id = :survey_id
    ORDER BY sf.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page;`,
    {
      survey_id: survey_id,
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
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query result
 */
async function get_survey_fields_list_for_survey_id__public(
  survey_id,
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
    `SELECT sf.*
    FROM survey_fields sf
    LEFT JOIN survey s
    ON s.id = sf.survey_id
    WHERE s.id = :survey_id
    AND s.public = true
    ORDER BY sf.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page;`,
    {
      survey_id: survey_id,
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
 * @param {number} field_type_id
 * @param {number} survey_id
 * @param {string} title
 * @returns {object} query result
 */
async function create_survey_field(field_type_id, survey_id, title) {
  return await performQuery(
    `INSERT INTO survey_fields (field_type_id, survey_id, title)
    VALUES (:field_type_id, :survey_id, :title)
    RETURNING *;`,
    { field_type_id: field_type_id, survey_id: survey_id, title: title }
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
    SET title = :survey_field_title
        survey_type_id = :survey_field_type_id
    WHERE id = :survey_field_id
    RETURNING *;`,
    {
      survey_field_title: survey_field_title,
      survey_field_type_id: survey_field_type_id,
      survey_field_id: survey_field_id,
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
 * @returns {object} query result
 */
async function delete_survey_field(survey_field_id) {
  return await performQuery(
    `DELETE FROM survey_fields
    WHERE id = :survey_field_id`,
    { survey_field_id: survey_field_id }
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
