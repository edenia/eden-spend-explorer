CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."global_amount" add column "id" uuid
 not null default gen_random_uuid();
