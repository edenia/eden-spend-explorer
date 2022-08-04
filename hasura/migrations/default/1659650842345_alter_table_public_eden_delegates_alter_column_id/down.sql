alter table "public"."eden_delegates" alter column "id" set default nextval('eden_delegates_id_seq'::regclass);
ALTER TABLE "public"."eden_delegates" ALTER COLUMN "id" TYPE integer;
