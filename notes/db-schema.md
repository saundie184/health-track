TABLE NAME users
- id
- firstname
- lastname
- email
- password

-- Vitals --
TABLE NAME vitals
- user_id
- DOB
- sex
- blood_type

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
- name
- description
- date

TABLE NAME illness
- user_id
- name
- description
- date

TABLE NAME procedures
- user_id
- name
- description
- date

TABLE NAME injuries
- user_id
- name
- description
- date

TABLE NAME other_events
- user_id
- name
- description
- date

-- Health Categories --
TABLE NAME food_allergies
- user_id
- name
- description
- date

TABLE NAME drug_allergies
- user_id
- name
- description
- date

TABLE NAME other_conditions
- user_id
- name
- description
- date

-- Relatives --

TABLE NAME relations
- user_id
- sister_id ??
- brother_id ??

TABLE NAME brothers
- user_id
- brother_name
- brother_id

TABLE NAME sisters
- user_id
- sister_name
- sister_id

TABLE NAME grandparents
- user_id
- mothers_dad
- mothers_mother
- dads_dad
- dads_mother

TABLE NAME dads_brothers
- user_id
- uncle_name
- fathers_brothers_name

TABLE NAME dads_sisters
- user_id
- fathers_sisters_name

TABLE NAME mothers_brothers
- user_id
- mothers_brothers_name

TABLE NAME mothers_sisters
- user_id
- mothers_sisters_name
