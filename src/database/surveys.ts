import { performQuery } from "./db";
import { handlePageSize } from "../utils/page_size";

const columns: string[] = [
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
export const isOwner_survey = async (survey_id: number, email: string) => {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email=:email`,
    new Map([["email", email]])
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
    new Map([["survey_id", survey_id]])
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
export const isPublic_survey = async (survey_id: number) => {
  let result = await performQuery(
    `
  SELECT public
  FROM surveys
  WHERE id = :survey_id
  AND public = true;
`,
    new Map([["survey_id", survey_id]])
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
export const get_survey_for_survey_id__public = async (survey_id: number) => {
  return await performQuery(
    `
  SELECT * 
  FROM surveys s
  WHERE s.id = :survey_id
  AND s.public = true;
`,
    new Map([["survey_id", survey_id]])
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_for_survey_id__public_or_owner = async (survey_id: number, email: string) => {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = :email`,
    new Map([["email", email]])
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
    new Map([
      ["survey_id", survey_id],
      ["account_id", account_id]
    ])
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_for_survey_id__all = async (survey_id: number) => {
  return await performQuery(
    `
    SELECT *
    FROM surveys 
    WHERE id = :survey_id;
  `,
    new Map([["survey_id", survey_id]])
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_for_survey_id__owner = async (survey_id: number, email: string) => {
  let account_id = await performQuery(
    `
  SELECT id FROM accounts WHERE email = :email;`,
    new Map([["email", email]])
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
    new Map([
      ["survey_id", survey_id],
      ["account_id", account_id]
    ])
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_list_for_email__all = async (
  email: string,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
  return await performQuery(
    `SELECT s.*
    FROM surveys s
    LEFT JOIN accounts a
    ON s.account_id = a.id
    WHERE a.email = :email
    ORDER BY s.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page;`,
    {
      email: email,
      order_by: order_by,
      order: order,
      offset: offset,
      per_page: per_page
    }
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_list_for_email__public_or_owner = async (
  email: string,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
    LIMIT :per_page;`,
    {
      email: email,
      order_by: order_by,
      order: order,
      offset: offset,
      per_page: per_page
    }
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_list_for_email__owner = async (
  email: string,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
      per_page: per_page
    }
  );
}
//
//
//
//
// ###############################################################################
export const get_survey_list__all = async (
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
  return await performQuery(
    `SELECT *
    FROM surveys
    ORDER BY ${columns.includes(order_by) ? order_by : "id"}
    ${order.toUpperCase() === "DESC" ? "DESC" : "ASC"}
    OFFSET :offset
    LIMIT :per_page_num;`,
    {
      order_by: order_by,
      order: order,
      offset: offset,
      per_page: per_page
    }
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_list__public_or_owner = async (
  email: string,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
      per_page: per_page
    }
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_list__owner = async (
  email: string,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
      per_page: per_page
    }
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_list__public = async (
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
      per_page: per_page
    }
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_list_for_email__public = async (
  email: string,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
      per_page: per_page
    }
  );
}

//
//
//
//
// ###############################################################################
export const create_survey_for_email = async (email: string, survey_title: string) => {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = :email;`,
    new Map([["email", email]])
  );
  account_id = account_id["rows"][0]["id"];

  return await performQuery(
    `INSERT INTO surveys (title, account_id)
        VALUES (:survey_title, :account_id)
        RETURNING *;`,
    new Map([
      ["survey_title", survey_title],
      ["account_id", account_id]
    ])
  );
}

//
//
//
//
// ###############################################################################
export const update_survey_for_survey_id = async (survey_title: string, pub: boolean, survey_id: string) => {
  if (!survey_title || !pub || !survey_id) {
    return console.log("Not all data provided.");
  }
  return await performQuery(
    `UPDATE surveys
    SET title = :survey_title
        public = :public
    WHERE id = :survey_id
    RETURNING id, title, account_id, created_at, modified_at;`,
    {
      survey_id: survey_id,
      public: pub,
      survey_title: survey_title
    }
  );
}

//
//
//
//
// ###############################################################################
export const delete_survey_by_survey_id = async (survey_id: number) => {
  return await performQuery(
    `DELETE FROM surveys
      WHERE id = :survey_id`,
    new Map([["survey_id", survey_id]])
  );
}

