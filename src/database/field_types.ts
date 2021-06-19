import { performQuery } from "./db";

//
//
//
//
// ###############################################################################
export const get_field_type_for_field_type_id = async (field_type_id: number) => {
  return await performQuery(
    `
    SELECT * 
    FROM field_types
    WHERE id = :field_type_id;
  `,
    new Map([["field_type_id", field_type_id]])
  );
}

//
//
//
//
// ###############################################################################
export const get_field_types_list = async () => {
  return await performQuery(
    `
    SELECT *
    FROM field_types;
  `,
    new Map()
  );
}

//
//
//
//
// ###############################################################################
export const create_field_type = async (name: string) => {
  return await performQuery(
    `INSERT INTO field_types (name)
    VALUES (:name)
    RETURNING *;`,
    new Map([["name", name]])
  );
}

//
//
//
//
// ###############################################################################
export const update_field_type = async (name: string, field_type_id: number) => {
  return await performQuery(
    `UPDATE field_types
    SET name = :name
    WHERE id = :field_type_id
    RETURNING *;`,
    {
      name: name,
      field_type_id: field_type_id
    }
  );
}

//
//
//
//
// ###############################################################################
export const delete_field_type = async (field_type_id: number) => {
  return await performQuery(
    `DELETE FROM field_types
    WHERE id = :field_type_id`,
    new Map([["field_type_id", field_type_id]])
  );
}