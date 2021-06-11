const pool = require("./db");

//
// ###############################################################################
async function get_field_type_for_field_type_id(field_type_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `
      SELECT * 
      FROM field_types
      WHERE id = $1;
    `,
      [field_type_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function get_field_types_list() {
  let client = await pool.connect();
  try {
    return await client.query(
      `
      SELECT *
      FROM field_types
    `
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function create_field_type(name) {
  let client = await pool.connect();
  console.log("name", name);
  try {
    // create survey_fields table entry
    return await client.query(
      `INSERT INTO field_types (name)
        VALUES ($1)
        RETURNING *;`,
      [name]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function update_field_type(name, field_type_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `UPDATE field_types
      SET name = $1
      WHERE id = $2
      RETURNING *;`,
      [name, field_type_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function delete_field_type(field_type_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `DELETE FROM field_types
      WHERE id = $1`,
      [field_type_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

module.exports = {
  get_field_type_for_field_type_id,
  get_field_types_list,
  create_field_type,
  update_field_type,
  delete_field_type,
};
