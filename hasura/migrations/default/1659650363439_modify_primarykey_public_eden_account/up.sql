BEGIN TRANSACTION;
ALTER TABLE "public"."eden_account" DROP CONSTRAINT "eden_account_pkey";

ALTER TABLE "public"."eden_account"
    ADD CONSTRAINT "eden_account_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;
