alter table "public"."total_expense_by_delegate_and_election" drop constraint "total_expense_by_delegate_and_election_pkey";
alter table "public"."total_expense_by_delegate_and_election"
    add constraint "total_expense_by_delegate_and_election_pkey"
    primary key ("id", "id_election");
