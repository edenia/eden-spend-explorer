comment on column "public"."eden_transaction"."id_election" is E'Eden Transaction Accounting Standard';
alter table "public"."eden_transaction" alter column "id_election" drop not null;
alter table "public"."eden_transaction" add column "id_election" int4;
