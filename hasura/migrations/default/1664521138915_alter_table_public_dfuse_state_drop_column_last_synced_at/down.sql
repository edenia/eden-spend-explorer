alter table "public"."dfuse_state" alter column "last_synced_at" drop not null;
alter table "public"."dfuse_state" add column "last_synced_at" timestamptz;
