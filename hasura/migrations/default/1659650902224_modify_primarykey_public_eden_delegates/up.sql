BEGIN TRANSACTION;
ALTER TABLE "public"."eden_delegates" DROP CONSTRAINT "eden_delegates_pkey";

ALTER TABLE "public"."eden_delegates"
    ADD CONSTRAINT "eden_delegates_pkey" PRIMARY KEY ("id_tmp");
COMMIT TRANSACTION;
