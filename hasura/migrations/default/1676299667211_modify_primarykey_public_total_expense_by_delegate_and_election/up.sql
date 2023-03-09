BEGIN TRANSACTION;
ALTER TABLE "public"."total_expense_by_delegate_and_election" DROP CONSTRAINT "total_expense_by_delegate_and_election_pkey";

ALTER TABLE "public"."total_expense_by_delegate_and_election"
    ADD CONSTRAINT "total_expense_by_delegate_and_election_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;
