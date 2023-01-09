CREATE TABLE "public"."eden_treasury" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "txid" varchar, "balance" numeric NOT NULL, "type" varchar NOT NULL, "amount" numeric NOT NULL, "date" timestamptz NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "eos_exchange" numeric NOT NULL DEFAULT 0, "usd_total" numeric NOT NULL DEFAULT 0, PRIMARY KEY ("id") , UNIQUE ("id"));COMMENT ON TABLE "public"."eden_treasury" IS E'This table have the treasury balance by transactions';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_eden_treasury_updated_at"
BEFORE UPDATE ON "public"."eden_treasury"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_eden_treasury_updated_at" ON "public"."eden_treasury" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
