alter table "public"."eden_delegates" drop constraint "eden_delegates_pkey";
alter table "public"."eden_delegates"
    add constraint "eden_delegates_pkey"
    primary key ("id");
