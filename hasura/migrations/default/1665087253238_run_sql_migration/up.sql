CREATE OR REPLACE VIEW "public"."percent_by_all_elections_expenses" AS 
 SELECT percent_by_election.election,
    (COALESCE(( SELECT sum(total_by_category_and_election.amount) AS sum
           FROM total_by_category_and_election
          WHERE (((total_by_category_and_election.category)::text <> 'uncategorized'::text) AND (total_by_category_and_election.election = percent_by_election.election) AND ((total_by_category_and_election.type)::text = 'expense'::text))), (0)::numeric) / total.amount) AS eos_categorized,
    (COALESCE(( SELECT sum(total_by_category_and_election.amount) AS sum
           FROM total_by_category_and_election
          WHERE (((total_by_category_and_election.category)::text = 'uncategorized'::text) AND (total_by_category_and_election.election = percent_by_election.election) AND ((total_by_category_and_election.type)::text = 'expense'::text))), (0)::numeric) / total.amount) AS eos_uncategorized,
    (COALESCE(( SELECT sum(total_by_category_and_election.usd_total) AS sum
           FROM total_by_category_and_election
          WHERE (((total_by_category_and_election.category)::text <> 'uncategorized'::text) AND (total_by_category_and_election.election = percent_by_election.election) AND ((total_by_category_and_election.type)::text = 'expense'::text))), (0)::numeric) / total.usd_total) AS usd_categorized,
    (COALESCE(( SELECT sum(total_by_category_and_election.usd_total) AS sum
           FROM total_by_category_and_election
          WHERE (((total_by_category_and_election.category)::text = 'uncategorized'::text) AND (total_by_category_and_election.election = percent_by_election.election) AND ((total_by_category_and_election.type)::text = 'expense'::text))), (0)::numeric) / total.usd_total) AS usd_uncategorized
   FROM (total_by_category_and_election percent_by_election
     JOIN total_by_election total ON ((total.election = percent_by_election.election)))
  WHERE (((percent_by_election.type)::text = 'expense'::text) AND ((total.type)::text = 'expense'::text))
  GROUP BY percent_by_election.election, total.usd_total, total.amount
  ORDER BY percent_by_election.election;
