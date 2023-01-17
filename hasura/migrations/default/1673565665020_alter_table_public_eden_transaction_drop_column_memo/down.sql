comment on column "public"."eden_transaction"."memo" is E'Eden Transaction Accounting Standard';
alter table "public"."eden_transaction" alter column "memo" drop not null;
alter table "public"."eden_transaction" add column "memo" varchar;
