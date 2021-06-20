import { performQuery } from "./db";
import { handlePageSize } from "../utils/page_size";

const columns: string[] = [
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
export const isPublic_survey_field = async (survey_field_id: number) => {
  let result = await performQuery(
    `
      SELECT public
      FROM surveys s
      LEFT JOIN survey_fields sf
      ON sf.survey_id = s.id
      WHERE sf.id = :survey_field_id
      AND s.public = true;
    `,
    new Map([["survey_field_id", survey_field_id]])
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
export const isOwner_survey_field = async (survey_field_id: number, email: string) => {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = :email`,
    { email: email });
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
    new Map([
      ["survey_field_id", survey_field_id],
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
export const get_survey_field_for_survey_field_id = async (survey_field_id: number) => {
  return await performQuery(
    `
    SELECT * 
    FROM survey_fields
    WHERE id = :survey_field_id;
  `,
    new Map([["survey_field_id", survey_field_id]])
  );
}

//
//
//
//
// ###############################################################################
export const get_survey_fields_list_for_survey_id__all = async (
  survey_id: number,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
      order_by: order,
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
export const get_survey_fields_list_for_survey_id__public = async (
  survey_id: number,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
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
      order_by: order,
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
export const create_survey_field = async (field_type_id: number, survey_id: number, title: string) => {
  return await performQuery(
    `INSERT INTO survey_fields (field_type_id, survey_id, title)
    VALUES (:field_type_id, :survey_id, :title)
    RETURNING *;`,
    {
      field_type_id: field_type_id,
      survey_id: survey_id,
      title: title
    }
  );
}

//
//
//
//
// ###############################################################################
export const update_survey_field = async (
  survey_field_id: number,
  survey_field_title: string,
  survey_field_type_id: number
) => {
  return await performQuery(
    `UPDATE survey_fields
    SET title = :survey_field_title
        survey_type_id = :survey_field_type_id
    WHERE id = :survey_field_id
    RETURNING *;`,
    {
      survey_field_title: survey_field_title,
      survey_field_id: survey_field_id,
      survey_field_type_id: survey_field_type_id
    }
  );
}

//
//
//
//
// ###############################################################################
export const delete_survey_field = async (survey_field_id: number) => {
  return await performQuery(
    `DELETE FROM survey_fields
    WHERE id = :survey_field_id`,
    new Map([["survey_field_id", survey_field_id]])
  );
}