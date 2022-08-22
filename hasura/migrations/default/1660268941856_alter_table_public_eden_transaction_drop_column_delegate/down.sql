comment on column "public"."eden_transaction"."delegate" is E'Eden Transaction Accounting Standard';
alter table "public"."eden_transaction" alter column "delegate" drop not null;
alter table "public"."eden_transaction" add column "delegate" varchar;
