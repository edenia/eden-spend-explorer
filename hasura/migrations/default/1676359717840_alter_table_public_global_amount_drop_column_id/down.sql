alter table "public"."global_amount" alter column "id" drop not null;
alter table "public"."global_amount" add column "id" uuid;
