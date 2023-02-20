CREATE OR REPLACE VIEW "public"."expenses_by_category_and_election" AS 
SELECT id_election,category,election, SUM(eos_amount) AS total_eos_amount, SUM(usd_amount) AS total_usd_amount
FROM total_expense_by_delegate_and_election
GROUP BY id_election, category, election;
