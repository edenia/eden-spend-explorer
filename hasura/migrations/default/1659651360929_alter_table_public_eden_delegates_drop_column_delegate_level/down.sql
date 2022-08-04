comment on column "public"."eden_delegates"."delegate_level" is E'elected delegates';
alter table "public"."eden_delegates" alter column "delegate_level" drop not null;
alter table "public"."eden_delegates" add column "delegate_level" int4;
