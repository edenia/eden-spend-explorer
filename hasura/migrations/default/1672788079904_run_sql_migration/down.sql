-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE VIEW "public"."total_expense_by_all_election" AS
-- SELECT election,
--        COALESCE(sum(amount) FILTER (WHERE type = 'expense' AND category != 'uncategorized'), 0) AS eos_categorized,
--        COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) + COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0) - COALESCE(sum(amount) FILTER (WHERE type = 'expense' AND category != 'uncategorized'), 0) AS eos_uncategorized,
--        COALESCE(sum(usd_total) FILTER (WHERE type = 'expense' AND category != 'uncategorized'), 0) AS usd_categorized,
--        COALESCE(sum(usd_total) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) + COALESCE(sum(usd_total) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0) - COALESCE(sum(usd_total) FILTER (WHERE type = 'expense' AND category != 'uncategorized'), 0) AS usd_uncategorized,
--        COALESCE(sum(amount) FILTER (WHERE type = 'expense' AND category != 'uncategorized'), 0) /
--        (CASE
--          WHEN (COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) = 0 AND COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0) = 0) THEN 1
--          ELSE COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) + COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0)
--        END) * 100 AS percent_categorized,
--        (COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) + COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0) - COALESCE(sum(amount) FILTER (WHERE type = 'expense' AND category != 'uncategorized'), 0)) /
--        (CASE
--          WHEN (COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) = 0 AND COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0) = 0) THEN 1
--          ELSE COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) + COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0)
--        END) * 100 AS percent_uncategorized
-- FROM total_by_category_and_election
-- GROUP BY election
-- ORDER BY election;
