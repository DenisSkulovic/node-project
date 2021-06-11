const pool = require("./db");

//
// ###############################################################################
async function get_survey_for_survey_id(survey_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `
      SELECT * 
      FROM survey 
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
// ###############################################################################
async function get_survey_list_for_email(email) {
  let client = await pool.connect();
  try {
    return await client.query(
      `SELECT *
      FROM survey s
      LEFT JOIN account a
      ON s.account_id = a.id
      WHERE a.email = $1;`,
      [email]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
async function create_survey_for_email(email, survey_title) {
  let client = await pool.connect();
  try {
    // get account id using email
    let account_id = await client.query(
      `SELECT id FROM accounts WHERE email = $1;`,
      [email]
    );

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
// ###############################################################################
async function update_survey_title_for_survey_id(survey_title, survey_id) {
  let client = await pool.connect();
  try {
    return await client.query(
      `UPDATE surveys
      SET title = $1
      WHERE id = $2
      RETURNING id, title, account_id, created_at, modified_at;`,
      [survey_title, survey_id]
    );
  } catch (error) {
    return console.log("Query error: ", error);
  } finally {
    client.release();
  }
}

//
// ###############################################################################
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

module.exports = {
  get_survey_for_survey_id,
  get_survey_list_for_email,
  create_survey_for_email,
  update_survey_title_for_survey_id,
  delete_survey_by_survey_id,
};
