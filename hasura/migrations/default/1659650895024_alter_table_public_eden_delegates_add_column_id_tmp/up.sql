CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."eden_delegates" add column "id_tmp" uuid
 not null unique default gen_random_uuid();
