alter table "public"."eden_election"
  add constraint "eden_election_id_delegate_fkey"
  foreign key ("id_delegate")
  references "public"."eden_delegates"
  ("id") on update restrict on delete restrict;
