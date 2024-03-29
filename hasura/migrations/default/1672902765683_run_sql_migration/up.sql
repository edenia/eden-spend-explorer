CREATE OR REPLACE VIEW "public"."historic_incomes" AS 
 SELECT historic_incomes.recipient,
    historic_incomes.election,
    historic_incomes.delegate_level,
    COALESCE(( SELECT sum(transaction_by_category_and_election.amount) AS sum
           FROM transaction_by_category_and_election
          WHERE (((transaction_by_category_and_election.category)::text = 'claimed'::text) AND ((transaction_by_category_and_election.recipient)::text = (historic_incomes.recipient)::text) AND ((transaction_by_category_and_election.type)::text = 'income'::text) AND (transaction_by_category_and_election.election = historic_incomes.election))), (0)::numeric) AS eos_claimed,
    COALESCE(( SELECT sum(transaction_by_category_and_election.amount) AS sum
           FROM transaction_by_category_and_election
          WHERE (((transaction_by_category_and_election.category)::text = 'unclaimed'::text) AND ((transaction_by_category_and_election.recipient)::text = (historic_incomes.recipient)::text) AND ((transaction_by_category_and_election.type)::text = 'income'::text) AND (transaction_by_category_and_election.election = historic_incomes.election))), (0)::numeric) AS eos_unclaimed,
    COALESCE(( SELECT sum(transaction_by_category_and_election.usd_total) AS sum
           FROM transaction_by_category_and_election
          WHERE (((transaction_by_category_and_election.category)::text = 'claimed'::text) AND ((transaction_by_category_and_election.recipient)::text = (historic_incomes.recipient)::text) AND ((transaction_by_category_and_election.type)::text = 'income'::text) AND (transaction_by_category_and_election.election = historic_incomes.election))), (0)::numeric) AS usd_claimed,
    COALESCE(( SELECT sum(transaction_by_category_and_election.usd_total) AS sum
           FROM transaction_by_category_and_election
          WHERE (((transaction_by_category_and_election.category)::text = 'unclaimed'::text) AND ((transaction_by_category_and_election.recipient)::text = (historic_incomes.recipient)::text) AND ((transaction_by_category_and_election.type)::text = 'income'::text) AND (transaction_by_category_and_election.election = historic_incomes.election))), (0)::numeric) AS usd_unclaimed,
    avg(historic_incomes.exchange_rate) AS exchange_rate
   FROM transaction_by_category_and_election historic_incomes
  WHERE ((historic_incomes.type)::text = 'income'::text)
  GROUP BY historic_incomes.recipient, historic_incomes.election, historic_incomes.type, historic_incomes.delegate_level
  ORDER BY historic_incomes.election;
