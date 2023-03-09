CREATE OR REPLACE VIEW total_expense_by_all_election AS
WITH election_sums AS (
  SELECT election, 
         COALESCE(SUM(eos_claimed + eos_unclaimed), 0) AS eos_sum,
         COALESCE(SUM(usd_claimed + usd_unclaimed), 0) AS usd_sum
  FROM historic_incomes
  GROUP BY election
)
SELECT ga.election,
       COALESCE(SUM(ga.eos_expense), 0) AS eos_categorized,
       COALESCE(SUM(ga.usd_expense), 0) AS usd_categorized,
       COALESCE(election_sums.eos_sum - SUM(ga.eos_expense), 0) AS eos_uncategorized,
       COALESCE(election_sums.usd_sum - SUM(ga.usd_expense), 0) AS usd_uncategorized,
       COALESCE(SUM(ga.eos_expense) / NULLIF(election_sums.eos_sum, 0) * 100, 0) AS percent_categorized
FROM global_amount ga
LEFT JOIN election_sums ON ga.election = election_sums.election
GROUP BY ga.election, election_sums.eos_sum, election_sums.usd_sum
ORDER BY ga.election;
