CREATE OR REPLACE VIEW "public"."percent_by_delegates_incomes" AS 
 SELECT incomes_by_delegates.recipient,
    incomes_by_delegates.election,
    (COALESCE(( SELECT sum(historic_incomes.eos_claimed) AS sum
           FROM historic_incomes
          WHERE ((historic_incomes.election = incomes_by_delegates.election) AND ((historic_incomes.recipient)::text = (incomes_by_delegates.recipient)::text))), (0)::numeric) / ((incomes_by_delegates.eos_claimed + incomes_by_delegates.eos_unclaimed))) AS eos_claimed,
    (COALESCE(( SELECT sum(historic_incomes.eos_unclaimed) AS sum
           FROM historic_incomes
          WHERE ((historic_incomes.election = incomes_by_delegates.election) AND ((historic_incomes.recipient)::text = (incomes_by_delegates.recipient)::text))), (0)::numeric) / ((incomes_by_delegates.eos_claimed + incomes_by_delegates.eos_unclaimed))) AS eos_unclaimed,
    (COALESCE(( SELECT sum(historic_incomes.usd_claimed) AS sum
           FROM historic_incomes
          WHERE ((historic_incomes.election = incomes_by_delegates.election) AND ((historic_incomes.recipient)::text = (incomes_by_delegates.recipient)::text))), (0)::numeric) / (incomes_by_delegates.usd_claimed + incomes_by_delegates.usd_unclaimed)) AS usd_claimed,
    (COALESCE(( SELECT sum(historic_incomes.usd_unclaimed) AS sum
           FROM historic_incomes
          WHERE ((historic_incomes.election = incomes_by_delegates.election) AND ((historic_incomes.recipient)::text = (incomes_by_delegates.recipient)::text))), (0)::numeric) / (incomes_by_delegates.usd_claimed + incomes_by_delegates.usd_unclaimed)) AS usd_unclaimed
  FROM historic_incomes incomes_by_delegates
  GROUP BY incomes_by_delegates.election, incomes_by_delegates.recipient, incomes_by_delegates.eos_claimed, incomes_by_delegates.eos_unclaimed, incomes_by_delegates.usd_claimed, incomes_by_delegates.usd_unclaimed
  ORDER BY incomes_by_delegates.election;
