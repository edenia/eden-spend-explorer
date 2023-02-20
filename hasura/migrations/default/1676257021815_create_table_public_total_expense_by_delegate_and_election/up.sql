CREATE TABLE "public"."total_expense_by_delegate_and_election" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "eos_amount" numeric NOT NULL DEFAULT 0, "usd_amount" numeric NOT NULL DEFAULT 0, "id_election" uuid NOT NULL, "category" varchar NOT NULL, "create_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id","id_election") , FOREIGN KEY ("id_election") REFERENCES "public"."eden_election"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"), UNIQUE ("id_election"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
