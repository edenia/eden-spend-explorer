-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE VIEW "public"."total_by_delegate_and_election" AS
--  SELECT hi.election,
--     hi.recipient AS account,
--     sum((hi.eos_claimed + hi.eos_unclaimed)) AS eos_income,
--     sum((hi.usd_unclaimed + hi.usd_claimed)) AS usd_income,
--     COALESCE(sum(ga.eos_expense), (0)::numeric) AS eos_expense,
--     COALESCE(sum(ga.usd_expense), (0)::numeric) AS usd_expense,
--     COALESCE(((sum(ga.eos_expense) / sum((hi.eos_claimed + hi.eos_unclaimed))) * (100)::numeric), (0)::numeric) AS percent_claimed
--    FROM (historic_incomes hi
--      LEFT JOIN global_amount ga ON (((hi.election = ga.election) AND ((hi.recipient)::text = ga.account))))
--   GROUP BY hi.election, hi.recipient;
