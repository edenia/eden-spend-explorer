CREATE OR REPLACE VIEW "public"."total_by_election" AS 
 SELECT eden_election.election,
    sum(eden_transaction.amount) AS amount,
    sum(eden_transaction.usd_total) AS usd_total,
    eden_transaction.type
   FROM (eden_election
     JOIN eden_transaction ON ((eden_transaction.id_election = eden_election.id)))
  GROUP BY eden_election.election, eden_transaction.type
  ORDER BY eden_election.election;