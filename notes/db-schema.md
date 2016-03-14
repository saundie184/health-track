TABLE NAME users
- id
- firstname
- lastname
- email
- password
- DOB
- sex
- blood_type

<!-- CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname TEXT,
  lastname TEXT,
  email TEXT,
  password TEXT
  );

  INSERT INTO users VALUES (1,'john', 'doe', 'john@email.com', 'password');
  INSERT INTO users VALUES (2,'jane', 'doe', 'jane@email.com', 'password2');
  INSERT INTO users VALUES (3,'jim', 'doe', 'jim@email.com', 'password3');
  INSERT INTO users VALUES (4,'jess', 'doe', 'jess@email.com', 'password4');
 -->


-- Vitals --
TABLE NAME height
- user_id
- height
- date

TABLE NAME weight
- user_id
- weight
- date

-- Health Events --
TABLE NAME surgeries
- user_id
- type (surgeries, illnesses, procedures, injuries, other_events)
- name
- description
- date


-- Health Categories --
TABLE NAME health_categories
- user_id
- type (food allergies, drug_allergies, other_categories)
- name
- description
- date

-- Relatives --
TABLE NAME relations
- id
- user_id
- name
- relationship
