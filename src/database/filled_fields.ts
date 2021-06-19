import { performQuery } from "./db";
import { handlePageSize } from "../utils/page_size";

const columns = [
  "id",
  "survey_field_id",
  "filled_survey_id",
  "answer",
  "created_at",
  "modified_at",
];

//
//
//
//
// ###############################################################################
export const isPublic_filled_field = async (filled_field_id: number) => {
  let result = await performQuery(
    `
    SELECT s.public
    FROM surveys s
    LEFT JOIN filled_surveys fs
    ON fs.survey_id = s.id
    LEFT JOIN filled_fields ff
    ON fs.id = ff.filled_survey_id
    WHERE ff.id = :filled_field_id
    AND s.public = true;
  `,
    new Map([["filled_field_id", filled_field_id]])
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
export const isOwner_filled_field = async (filled_field_id: number, email: string) => {
  let account_id = await performQuery(
    `
  SELECT id FROM accounts WHERE email = :email;`,
    new Map([["email", email]])
  );
  if (account_id.rows.length === 0) {
    return false;
  }
  account_id = account_id.rows[0]["id"];

  let result = await performQuery(
    `
    SELECT a.email 
    FROM filled_fields ff
    LEFT JOIN filled_surveys fs
    ON ff.filled_survey_id = fs.id
    LEFT JOIN accounts a
    ON a.id = ff.account_id
    WHERE ff.id = :filled_field_id
    AND fs.account_id = :account_id;
  `,
    new Map([["filled_field_id", filled_field_id], ["account_id", account_id]])
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
export const isSurveyOwner_filled_field = async (filled_field_id: number, email: string) => {
  let account_id = await performQuery(
    `SELECT id FROM accounts WHERE email = :email`,
    new Map([["email", email]])
  );
  if (account_id.rows.length === 0) {
    return false;
  }
  account_id = account_id.rows[0]["id"];

  let result = await performQuery(
    `
    SELECT a.email 
    FROM filled_fields ff
    LEFT JOIN filled_surveys fs
    ON ff.filled_survey_id = fs.id
    LEFT JOIN surveys s
    ON s.id = fs.survey_id
    WHERE ff.id = :filled_field_id
    AND s.account_id = :account_id;
  `,
    new Map([
      ["filled_field_id", filled_field_id],
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
export const get_filled_field_for_filled_field_id = async (filled_field_id: number) => {
  return await performQuery(
    `
    SELECT * 
    FROM filled_fields
    WHERE id = :filled_field_id;
  `,
    new Map([
      ["filled_field_id", filled_field_id]
    ]
    )
  );
}

//
//
//
//
// ###############################################################################
export const get_filled_fields_list_for_filled_survey_id = async (
  filled_survey_id: number,
  order_by: string = "id",
  page: number = 1,
  per_page: number = 10,
  order: string = "ASC"
) => {
  per_page = handlePageSize(per_page, "large");
  let offset = page * per_page - per_page;
  return await performQuery(
    `SELECT ff.*
    FROM filled_fields ff
    LEFT JOIN filled_surveys fs
    ON ff.filled_survey_id = fs.id
    WHERE fs.id = :filled_survey_id
    ORDER BY ff.${columns.includes(order_by) ? order_by : "id"}
    ${order === "DESC" ? "DESC" : "ASC"}    
    OFFSET :offset
    LIMIT :per_page;`,
    {
      filled_survey_id: filled_survey_id,
      order: order,
      order_by: order_by,
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
export const create_filled_field = async (survey_field_id: number, filled_survey_id: number, answer: string) => {
  return await performQuery(
    `INSERT INTO filled_fields (survey_field_id, filled_survey_id, answer)
    VALUES (:survey_field_id, :filled_survey_id, :answer)
    RETURNING *;`,
    {
      survey_field_id: survey_field_id,
      filled_survey_id: filled_survey_id,
      answer: answer
    }
  );
}

//
//
//
//
// ###############################################################################
export const update_filled_field = async (
  survey_field_id: number,
  filled_survey_id: number,
  answer: string,
  filled_field_id: number
) => {
  return await performQuery(
    `UPDATE survey_fields
    SET survey_field_id = :survey_field_id
      filled_survey_id = :filled_survey_id
      answer = :answer
    WHERE id = :filled_field_id
    RETURNING *;`,
    {
      survey_field_id: survey_field_id,
      filled_survey_id: filled_survey_id,
      answer: answer,
      filled_field_id: filled_field_id
    }
  );
}

//
//
//
//
// ###############################################################################
export const delete_filled_field = async (filled_field_id: number) => {
  return await performQuery(
    `DELETE FROM filled_fields
    WHERE id = :filled_field_id`,
    new Map([
      ["filled_field_id", filled_field_id]
    ])
  );
}
