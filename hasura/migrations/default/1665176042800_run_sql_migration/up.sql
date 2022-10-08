CREATE OR REPLACE VIEW "public"."historic_expenses" AS 
 SELECT historic_expenses.delegate_payer,
    historic_expenses.election,
    COALESCE(( SELECT sum(transaction_by_category_and_election.amount) AS sum
           FROM transaction_by_category_and_election
          WHERE (((transaction_by_category_and_election.category)::text <> 'uncategorized'::text) AND ((transaction_by_category_and_election.delegate_payer)::text = (historic_expenses.delegate_payer)::text) AND ((transaction_by_category_and_election.type)::text = 'expense'::text) AND (transaction_by_category_and_election.election = historic_expenses.election))), (0)::numeric) AS eos_categorized,
    COALESCE(( SELECT sum(transaction_by_category_and_election.amount) AS sum
           FROM transaction_by_category_and_election
          WHERE (((transaction_by_category_and_election.category)::text = 'uncategorized'::text) AND ((transaction_by_category_and_election.delegate_payer)::text = (historic_expenses.delegate_payer)::text) AND ((transaction_by_category_and_election.type)::text = 'expense'::text) AND (transaction_by_category_and_election.election = historic_expenses.election))), (0)::numeric) AS eos_uncategorized,
    COALESCE(( SELECT sum(transaction_by_category_and_election.usd_total) AS sum
           FROM transaction_by_category_and_election
          WHERE (((transaction_by_category_and_election.category)::text <> 'uncategorized'::text) AND ((transaction_by_category_and_election.delegate_payer)::text = (historic_expenses.delegate_payer)::text) AND ((transaction_by_category_and_election.type)::text = 'expense'::text) AND (transaction_by_category_and_election.election = historic_expenses.election))), (0)::numeric) AS usd_categorized,
    COALESCE(( SELECT sum(transaction_by_category_and_election.usd_total) AS sum
           FROM transaction_by_category_and_election
          WHERE (((transaction_by_category_and_election.category)::text = 'uncategorized'::text) AND ((transaction_by_category_and_election.delegate_payer)::text = (historic_expenses.delegate_payer)::text) AND ((transaction_by_category_and_election.type)::text = 'expense'::text) AND (transaction_by_category_and_election.election = historic_expenses.election))), (0)::numeric) AS usd_uncategorized,
    avg(historic_expenses.exchange_rate) AS exchange_rate
   FROM transaction_by_category_and_election historic_expenses
  WHERE ((historic_expenses.type)::text = 'expense'::text)
  GROUP BY historic_expenses.delegate_payer, historic_expenses.election, historic_expenses.type
  ORDER BY historic_expenses.election;
