CREATE OR REPLACE VIEW "public"."categorized_expenses" AS 
 SELECT expenses.election,
    sum(expenses.amount) AS amount,
    sum(expenses.usd_total) AS usd_total
   FROM total_by_category_and_election expenses
  WHERE (((expenses.type)::text = 'expense'::text) AND ((expenses.category)::text <> 'uncategorized'::text))
  GROUP BY expenses.election;
