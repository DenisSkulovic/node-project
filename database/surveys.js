const pool = require("./db");

//
//
//
//
// ###############################################################################
/**
 * isOwner_survey
 * @param {number} survey_id
 * @returns {boolean}
 */
async function isOwner_survey(survey_id, email) {
  let client = await pool.connect();
  try {
    let result = await client.query(
      `
      SELECT a.email
      FROM surveys s
      LEFT JOIN accounts a
      ON a.id = s.account_id
      WHERE sf.id = $1;
    `,
      [survey_id]
    );
    if (result.rows[0]["email"] == email) {
      return true;
    }
    return false;
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * isPublic_survey
 * @param {number} survey_id
 * @returns {boolean}
 */
async function isPublic_survey(survey_id) {
  let client = await pool.connect();
  try {
    let result = await client.query(
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
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * get_survey_for_survey_id__public
 * @param {string} survey_id
 * @returns {object} query results
 */
async function get_survey_for_survey_id__public(survey_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `
      SELECT * 
      FROM surveys s
      WHERE s.id = $1
      AND s.public = true;
    `,
      [survey_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * get_survey_for_survey_id__public_or_owner
 * @param {string} survey_id
 * @returns {object} query results
 */
async function get_survey_for_survey_id__public_or_owner(survey_id, email) {
  let client = await pool.connect();
  try {
    let account_id = await client.query(
      `
    SELECT id FROM accounts WHERE email = $1`,
      [email]
    );
    return await client.query(
      `
      SELECT * 
      FROM surveys s
      WHERE s.id = $1
      AND s.public = true
      OR s.account_id = $2;
    `,
      [survey_id, account_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * get_survey_for_survey_id__all
 * @param {string} survey_id
 * @returns {object} query results
 */
async function get_survey_for_survey_id__all(survey_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `
      SELECT *
      FROM surveys 
      WHERE id = $1;
    `,
      [survey_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * get_survey_list_for_email__all
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query results
 */
async function get_survey_list_for_email__all(
  email,
  order_by = "title",
  page = 1,
  per_page = 10
) {
  let client = await pool.connect();
  try {
    page_num = parseInt(page);
    per_page_num = parseInt(per_page);
    let offset = page_num * per_page_num - per_page_num;
    return await client.query(
      `SELECT s.*
      FROM surveys s
      LEFT JOIN accounts a
      ON s.account_id = a.id
      WHERE a.email = $1
      ORDER BY $2
      DESC
      OFFSET $3
      LIMIT $4;`,
      [email, order_by, offset, per_page_num]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * get_survey_list__all
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query results
 */
async function get_survey_list__all(
  order_by = "title",
  page = 1,
  per_page = 10
) {
  let client = await pool.connect();
  try {
    page_num = parseInt(page);
    per_page_num = parseInt(per_page);
    let offset = page_num * per_page_num - per_page_num;
    return await client.query(
      `SELECT s.*
      FROM surveys s
      ORDER BY $1
      DESC
      OFFSET $2
      LIMIT $3;`,
      [order_by, offset, per_page_num]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * get_survey_list__public_or_owner
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query results
 */
async function get_survey_list__public_or_owner(
  email,
  order_by = "title",
  page = 1,
  per_page = 10
) {
  let client = await pool.connect();
  try {
    page_num = parseInt(page);
    per_page_num = parseInt(per_page);
    let offset = page_num * per_page_num - per_page_num;
    return await client.query(
      `SELECT s.*
      FROM surveys s
      LEFT JOIN accounts a
      ON s.account_id = a.id
      WHERE a.email = $1
      OR s.public = true
      ORDER BY $2
      DESC
      OFFSET $3
      LIMIT $4;`,
      [email, order_by, offset, per_page_num]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * get_survey_list__public
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query results
 */
async function get_survey_list__public(
  order_by = "title",
  page = 1,
  per_page = 10
) {
  let client = await pool.connect();
  try {
    page_num = parseInt(page);
    per_page_num = parseInt(per_page);
    let offset = page_num * per_page_num - per_page_num;
    return await client.query(
      `SELECT s.*
      FROM surveys s
      LEFT JOIN accounts a
      ON s.account_id = a.id
      WHERE s.public = true
      ORDER BY $2
      DESC
      OFFSET $3
      LIMIT $4;`,
      [order_by, offset, per_page_num]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * get_survey_list_for_email__public
 * @param {string} email
 * @param {string} order_by
 * @param {number} page
 * @param {number} per_page
 * @returns {object} query results
 */
async function get_survey_list_for_email__public(
  email,
  order_by = "title",
  page = 1,
  per_page = 10
) {
  let client = await pool.connect();
  try {
    page_num = parseInt(page);
    per_page_num = parseInt(per_page);
    let offset = page_num * per_page_num - per_page_num;
    return await client.query(
      `SELECT s.*
      FROM surveys s
      LEFT JOIN accounts a
      ON s.account_id = a.id
      WHERE a.email = $1
      AND s.public = true
      ORDER BY $2
      DESC
      OFFSET $3
      LIMIT $4;`,
      [email, order_by, offset, per_page_num]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * create_survey_for_email
 * @param {string} email
 * @param {string} survey_title
 * @returns {object} query results
 */
async function create_survey_for_email(email, survey_title) {
  let client = await pool.connect();
  try {
    // get account id using email
    let account_id = await client.query(
      `SELECT id FROM accounts WHERE email = $1;`,
      [email]
    );
    account_id = account_id["rows"][0]["id"];
    console.log("account_id", account_id);

    // create surveys table entry
    return await client.query(
      `INSERT INTO surveys (title, account_id)
        VALUES ($1, $2)
        RETURNING *;`,
      [survey_title, account_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * update_survey_title_for_survey_id
 * @param {string} survey_title
 * @param {bool} public
 * @param {number} survey_id
 * @returns {object} query results
 */
async function update_survey_for_survey_id(survey_title, public, survey_id) {
  if (!survey_title || !public || !survey_id) {
    return console.log("Not all data provided.");
  }

  let client = await pool.connect();
  try {
    return await client.query(
      `UPDATE surveys
      SET title = $1
          public = $2
      WHERE id = $3
      RETURNING id, title, account_id, created_at, modified_at;`,
      [survey_title, public, survey_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
//
// ###############################################################################
/**
 * delete_survey_by_survey_id
 * @param {number} survey_id
 * @returns {object} query results
 */
async function delete_survey_by_survey_id(survey_id) {
  let client = await pool.connect();
  try {
    return client.query(
      `DELETE FROM surveys
      WHERE id = $1`,
      [survey_id],
      (error, results) => {
        release();
        if (error) {
          return console.log("Query error: ", error);
        }
        console.log("Query successful.");
      }
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
//
//
// ###############################################################################
module.exports = {
  isPublic_survey,
  isOwner_survey,
  get_survey_for_survey_id__public,
  get_survey_for_survey_id__public_or_owner,
  get_survey_for_survey_id__all,
  get_survey_list_for_email__all,
  get_survey_list_for_email__public,
  get_survey_list__all,
  get_survey_list__public_or_owner,
  get_survey_list__public,
  create_survey_for_email,
  update_survey_for_survey_id,
  delete_survey_by_survey_id,
};
