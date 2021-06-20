import { performQuery } from "./db";
import { handlePageSize } from "../utils/page_size";

const columns: string[] = ["id", "survey_id", "account_id", "created_at", "modified_at"];

//
//
//
//
// ###############################################################################
export const isPublic_filled_survey = async (filled_survey_id: number) => {
  let result = await performQuery(
    `
    SELECT s.public
    FROM surveys s
    LEFT JOIN filled_surveys fs
    ON fs.survey_id = s.id
    WHERE fs.id = :filled_survey_id
    AND s.public = true;
  `,
    new Map([["filled_survey_id", filled_survey_id]])
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
export const isOwner_filled_survey = async (filled_survey_id: number, email: string) => {
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
    new Map([
      ["filled_survey_id", filled_survey_id],
      ["account_id", account_id]
    ])
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
export const isSurveyOwner_filled_survey = async (filled_survey_id: number, email: string) => {
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
    new Map([
      ["filled_survey_id", filled_survey_id],
      ["account_id", account_id]
    ])
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
export const get_filled_survey_for_filled_survey_id = async (filled_survey_id: number) => {
  return await performQuery(
    `SELECT * 
    FROM filled_surveys
    WHERE id = :filled_survey_id;`,
    new Map([["filled_survey_id", filled_survey_id]])
  );
}

//
//
//
//
// ###############################################################################
export const get_filled_survey_list_for_email__all = async (
  email: string,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
    new Map([
      ["account_id", account_id],
      ["order_by", order_by],
      ["order", order],
      ["offset", offset],
      ["per_page", per_page]
    ])
  );
}

//
//
//
//
// ###############################################################################
export const get_filled_survey_list_for_email__filledSurveyOwner = async (
  email: string,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
    new Map([
      ["account_id", account_id],
      ["order_by", order_by],
      ["order", order],
      ["offset", offset],
      ["per_page", per_page]
    ])
  );
}

//
//
//
//
// ###############################################################################
export const get_filled_survey_list_for_email__surveyOwner = async (
  email: string,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
    new Map([
      ["account_id", account_id],
      ["order_by", order_by],
      ["order", order],
      ["offset", offset],
      ["per_page", per_page]
    ])
  );
}

//
//
//
//
// ###############################################################################
export const get_filled_survey_list_for_email__public = async (
  email: string,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
    new Map([
      ["account_id", account_id],
      ["order_by", order_by],
      ["order", order],
      ["offset", offset],
      ["per_page", per_page]
    ])
  );
}

//
//
//
//
// ###############################################################################
export const create_filled_survey_for_survey_id = async (survey_id: number, email: string) => {
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
      new Map([
        ["survey_id", survey_id],
        ["account_id", account_id]
      ])
    );
  }
  return await performQuery(
    `INSERT INTO filled_surveys (survey_id)
        VALUES (:survey_id)
        RETURNING *;`,
    new Map([["survey_id", survey_id]])
  );
}

//
//
//
//
// ###############################################################################
export const delete_filled_survey = async (filled_survey_id: number) => {
  return await performQuery(
    `DELETE FROM filled_surveys
    WHERE id = :filled_survey_id`,
    new Map([["filled_survey_id", filled_survey_id]])
  );
}
