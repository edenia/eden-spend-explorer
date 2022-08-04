alter table "public"."eden_transaction"
  add constraint "eden_transaction_id_election_fkey"
  foreign key ("id_election")
  references "public"."eden_election"
  ("id") on update restrict on delete restrict;
