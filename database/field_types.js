const { performQuery } = require("./db");

//
//
//
//
// ###############################################################################
/**
 *
 * @param {number} field_type_id
 * @returns {object} query result
 */
async function get_field_type_for_field_type_id(field_type_id) {
  return await performQuery(
    `
    SELECT * 
    FROM field_types
    WHERE id = $1;
  `,
    [field_type_id]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @returns {object} query result
 */
async function get_field_types_list() {
  return await performQuery(
    `
    SELECT *
    FROM field_types
  `,
    []
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {string} name
 * @returns {object} query result
 */
async function create_field_type(name) {
  return await performQuery(
    `INSERT INTO field_types (name)
    VALUES ($1)
    RETURNING *;`,
    [name]
  );
}

//
//
//
//
// ###############################################################################
/**
 *
 * @param {string} name
 * @param {number} field_type_id
 * @returns {object} query result
 */
async function update_field_type(name, field_type_id) {
  return await performQuery(
    `UPDATE field_types
    SET name = $1
    WHERE id = $2
    RETURNING *;`,
    [name, field_type_id]
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
 * @returns {object} query result
 */
async function delete_field_type(field_type_id) {
  return await performQuery(
    `DELETE FROM field_types
    WHERE id = $1`,
    [field_type_id]
  );
}

//
//
//
//
// ###############################################################################
module.exports = {
  get_field_type_for_field_type_id,
  get_field_types_list,
  create_field_type,
  update_field_type,
  delete_field_type,
};
