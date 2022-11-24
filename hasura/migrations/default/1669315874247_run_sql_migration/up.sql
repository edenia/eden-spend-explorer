CREATE OR REPLACE VIEW "public"."percent_by_delegates_expenses" AS
SELECT expenses_by_delegates.delegate_payer,
    expenses_by_delegates.election,
    (COALESCE(( SELECT sum(historic_expenses.eos_categorized) AS sum
           FROM historic_expenses
          WHERE ((historic_expenses.election = expenses_by_delegates.election) AND ((historic_expenses.delegate_payer)::text = (expenses_by_delegates.delegate_payer)::text))), (0)::numeric) / (expenses_by_delegates.eos_categorized + expenses_by_delegates.eos_uncategorized)) AS eos_categorized,
    (COALESCE(( SELECT sum(historic_expenses.eos_uncategorized) AS sum
           FROM historic_expenses
          WHERE ((historic_expenses.election = expenses_by_delegates.election) AND ((historic_expenses.delegate_payer)::text = (expenses_by_delegates.delegate_payer)::text))), (0)::numeric) / (expenses_by_delegates.eos_categorized + expenses_by_delegates.eos_uncategorized)) AS eos_uncategorized,
    (COALESCE(( SELECT sum(historic_expenses.usd_categorized) AS sum
           FROM historic_expenses
          WHERE ((historic_expenses.election = expenses_by_delegates.election) AND ((historic_expenses.delegate_payer)::text = (expenses_by_delegates.delegate_payer)::text))), (0)::numeric) / (expenses_by_delegates.usd_categorized + expenses_by_delegates.usd_uncategorized)) AS usd_categorized,
    (COALESCE(( SELECT sum(historic_expenses.usd_uncategorized) AS sum
           FROM historic_expenses
          WHERE ((historic_expenses.election = expenses_by_delegates.election) AND ((historic_expenses.delegate_payer)::text = (expenses_by_delegates.delegate_payer)::text))), (0)::numeric) / (expenses_by_delegates.usd_categorized + expenses_by_delegates.usd_uncategorized)) AS usd_uncategorized
  FROM historic_expenses expenses_by_delegates
  GROUP BY expenses_by_delegates.election, expenses_by_delegates.delegate_payer, expenses_by_delegates.eos_categorized, expenses_by_delegates.eos_uncategorized, expenses_by_delegates.usd_categorized, expenses_by_delegates.usd_uncategorized
  ORDER BY expenses_by_delegates.election;
