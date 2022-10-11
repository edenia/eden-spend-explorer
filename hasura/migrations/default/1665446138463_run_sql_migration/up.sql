CREATE OR REPLACE VIEW "public"."categorized_expenses_by_delegate" AS
SELECT expenses.election,
    expenses.delegate_payer,
    sum(expenses.amount) as amount,
    sum(expenses.usd_total) as usd_total,
    avg(expenses.exchange_rate) as exchange_rate
   FROM transaction_by_category_and_election expenses
  WHERE (((expenses.type)::text = 'expense'::text) AND ((expenses.category)::text <> 'uncategorized'::text))
  group by expenses.election, expenses.delegate_payer;
