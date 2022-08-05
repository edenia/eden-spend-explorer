alter table "public"."eden_account" drop constraint "eden_account_pkey";
alter table "public"."eden_account"
    add constraint "eden_account_pkey"
    primary key ("txid");
