CREATE OR REPLACE VIEW "public"."percent_by_all_elections_incomes" AS
SELECT percent_by_election.election,
    (COALESCE(( SELECT sum(total_by_category_and_election.amount) AS sum
           FROM total_by_category_and_election
          WHERE (((total_by_category_and_election.category)::text = 'claimed'::text) AND (total_by_category_and_election.election = percent_by_election.election) AND (total_by_category_and_election.type = 'income'))), (0)::numeric) / total.amount) AS eos_claimed,
    (COALESCE(( SELECT sum(total_by_category_and_election.amount) AS sum
           FROM total_by_category_and_election
          WHERE (((total_by_category_and_election.category)::text = 'unclaimed'::text) AND (total_by_category_and_election.election = percent_by_election.election) AND (total_by_category_and_election.type = 'income'))), (0)::numeric) / total.amount) AS eos_unclaimed,
    (COALESCE(( SELECT sum(total_by_category_and_election.usd_total) AS sum
           FROM total_by_category_and_election
          WHERE (((total_by_category_and_election.category)::text = 'claimed'::text) AND (total_by_category_and_election.election = percent_by_election.election) AND (total_by_category_and_election.type = 'income'))), (0)::numeric) / total.usd_total) AS usd_claimed,
    (COALESCE(( SELECT sum(total_by_category_and_election.usd_total) AS sum
           FROM total_by_category_and_election
          WHERE (((total_by_category_and_election.category)::text = 'unclaimed'::text) AND (total_by_category_and_election.election = percent_by_election.election) AND (total_by_category_and_election.type = 'income'))), (0)::numeric) / total.usd_total) AS usd_unclaimed
   FROM (total_by_category_and_election percent_by_election
     JOIN total_by_election total ON ((total.election = percent_by_election.election)))
    where percent_by_election.type = 'income' and total.type='income'
  GROUP BY percent_by_election.election, total.usd_total, total.amount
  ORDER BY percent_by_election.election;
