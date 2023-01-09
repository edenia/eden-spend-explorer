CREATE OR REPLACE VIEW "public"."total_income_by_all_elections" AS
SELECT election,
       COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) AS eos_claimed,
       COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0) AS eos_unclaimed,
       COALESCE(sum(usd_total) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) AS usd_claimed,
       COALESCE(sum(usd_total) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0) AS usd_unclaimed,
       COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) / 
       (CASE
         WHEN (COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) = 0 AND COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0) = 0) THEN 1
         ELSE COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) + COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0)
       END) * 100 AS percent_claimed,
       COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0) / 
       (CASE
         WHEN (COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) = 0 AND COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0) = 0) THEN 1
         ELSE COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'claimed'), 0) + COALESCE(sum(amount) FILTER (WHERE type = 'income' AND category = 'unclaimed'), 0)
       END) * 100 AS percent_unclaimed
FROM total_by_category_and_election
GROUP BY total_by_category_and_election.election
ORDER BY total_by_category_and_election.election;
