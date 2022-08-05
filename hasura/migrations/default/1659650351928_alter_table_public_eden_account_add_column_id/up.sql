CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."eden_account" add column "id" uuid
 not null default gen_random_uuid();
