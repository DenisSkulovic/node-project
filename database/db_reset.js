const { performQuery } = require("./db");

//
//
//
//
// ###############################################################################
/**
 * Drop every table, create tables and populate them with initial data
 * @returns {object} Query result after creating an admin account. Contains the admin email and admin status.
 */
async function resetDatabase() {
  await performQuery(
    `
  DROP TABLE IF EXISTS accounts CASCADE;
  DROP TABLE IF EXISTS field_types CASCADE;
  DROP TABLE IF EXISTS surveys CASCADE;
  DROP TABLE IF EXISTS survey_fields CASCADE;
  DROP TABLE IF EXISTS filled_surveys CASCADE;
  DROP TABLE IF EXISTS filled_fields CASCADE;



  CREATE TABLE accounts(
  id SERIAL,
  email VARCHAR (255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  isadmin BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
  );
  ALTER TABLE accounts ALTER COLUMN isadmin SET DEFAULT false;



  CREATE TABLE field_types(
  id SERIAL,
  name VARCHAR (255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
  );



  CREATE TABLE surveys(
  id SERIAL,
  title VARCHAR (255) NOT NULL,
  public BOOLEAN NOT NULL,
  account_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  CONSTRAINT fk_account
    FOREIGN KEY(account_id)
    REFERENCES accounts(id)
    ON DELETE RESTRICT
  );
  ALTER TABLE surveys ALTER COLUMN public SET DEFAULT false;



  CREATE TABLE survey_fields(
  id SERIAL,
  field_type_id BIGINT NOT NULL,
  survey_id BIGINT NOT NULL,
  title VARCHAR (255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  CONSTRAINT fk_field_type
    FOREIGN KEY(field_type_id)
    REFERENCES field_types(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_survey
    FOREIGN KEY(survey_id)
    REFERENCES surveys(id)
    ON DELETE CASCADE
  );



  CREATE TABLE filled_surveys (
  id SERIAL,
  survey_id BIGINT NOT NULL,
  account_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  CONSTRAINT fk_survey
    FOREIGN KEY(survey_id)
    REFERENCES surveys(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_account
    FOREIGN KEY(account_id)
    REFERENCES accounts(id)
    ON DELETE CASCADE
  );



  CREATE TABLE filled_fields (
  id SERIAL,
  survey_field_id BIGINT NOT NULL,
  filled_survey_id BIGINT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  CONSTRAINT fk_survey_field
    FOREIGN KEY(survey_field_id)
    REFERENCES survey_fields(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_filled_survey
    FOREIGN KEY(filled_survey_id)
    REFERENCES filled_surveys(id)
    ON DELETE CASCADE
  );


  
  /* function to automatically update timestamp */
  CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
  NEW.modified_at = NOW();
  RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON field_types
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON filled_fields
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON filled_surveys
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON survey_fields
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON surveys
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();
  `,
    []
  );

  await performQuery(
    `
  INSERT INTO field_types (name)
    VALUES ("textarea"),
          ("radio"),
          ("input_text"),
          ("input_number"),
          ("input_checkbox");
  `,
    []
  );

  return await performQuery(
    `
    INSERT INTO accounts (email, password, isadmin)
    VALUES (:email, :password, :isadmin)
    RETURNIING email, isadmin;
    `,
    { email: "admin@email.com", password: "123456789", isadmin: true }
  );
}

//
//
//
//
// ###############################################################################
module.exports = resetDatabase;
