comment on column "public"."eden_delegates"."election_round" is E'elected delegates';
alter table "public"."eden_delegates" alter column "election_round" drop not null;
alter table "public"."eden_delegates" add column "election_round" int4;
