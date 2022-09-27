CREATE OR REPLACE VIEW "public"."incomes_claimed_and_unclaimed" AS
 SELECT eden_election.election,
    eden_transaction.recipient,
    eden_transaction.category,
    sum(eden_transaction.amount) AS amount,
    sum(eden_transaction.usd_total) AS usd_total,
    avg(eden_transaction.eos_exchange) AS exchange_rate
   FROM (eden_election
     JOIN eden_transaction ON ((eden_transaction.id_election = eden_election.id)))
  WHERE ((eden_transaction.type)::text = 'income'::text)
  GROUP BY eden_transaction.recipient, eden_transaction.category, eden_election.election;
