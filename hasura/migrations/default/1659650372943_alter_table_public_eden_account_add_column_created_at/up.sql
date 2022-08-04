alter table "public"."eden_account" add column "created_at" timestamptz
 not null default now();
