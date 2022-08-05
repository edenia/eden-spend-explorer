comment on column "public"."eden_delegates"."id" is E'elected delegates';
alter table "public"."eden_delegates" alter column "id" drop not null;
alter table "public"."eden_delegates" add column "id" int4;
