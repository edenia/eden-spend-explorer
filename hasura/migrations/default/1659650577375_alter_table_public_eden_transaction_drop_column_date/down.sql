comment on column "public"."eden_transaction"."date" is E'Eden Accounting Standard';
alter table "public"."eden_transaction" alter column "date" drop not null;
alter table "public"."eden_transaction" add column "date" timestamptz;
