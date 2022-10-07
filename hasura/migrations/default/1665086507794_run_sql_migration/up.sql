CREATE OR REPLACE VIEW "public"."transaction_by_category_and_election" AS 
 SELECT eden_election.election,
    eden_transaction.recipient,
    eden_transaction.category,
    sum(eden_transaction.amount) AS amount,
    sum(eden_transaction.usd_total) AS usd_total,
    avg(eden_transaction.eos_exchange) AS exchange_rate,
    eden_transaction.type,
    eden_delegates.account as delegate_payer
   FROM (eden_election
     JOIN eden_transaction ON ((eden_transaction.id_election = eden_election.id))
     join eden_delegates on eden_election.id_delegate = eden_delegates.id)
  GROUP BY eden_transaction.recipient, eden_transaction.category, eden_election.election, eden_transaction.type, eden_delegates.account
  ORDER BY eden_election.election;
