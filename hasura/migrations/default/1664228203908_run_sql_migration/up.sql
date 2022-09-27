CREATE OR REPLACE VIEW "public"."historic_incomes" AS 
 SELECT historic_incomes.recipient,
    historic_incomes.election,
    COALESCE(( SELECT sum(incomes_claimed_and_unclaimed.amount) AS sum
           FROM incomes_claimed_and_unclaimed
          WHERE (((incomes_claimed_and_unclaimed.category)::text = 'claimed'::text) AND ((incomes_claimed_and_unclaimed.recipient)::text = (historic_incomes.recipient)::text))), (0)::numeric) AS eos_claimed,
    COALESCE(( SELECT sum(incomes_claimed_and_unclaimed.amount) AS sum
           FROM incomes_claimed_and_unclaimed
          WHERE (((incomes_claimed_and_unclaimed.category)::text = 'unclaimed'::text) AND ((incomes_claimed_and_unclaimed.recipient)::text = (historic_incomes.recipient)::text))), (0)::numeric) AS eos_unclaimed,
    COALESCE(( SELECT sum(incomes_claimed_and_unclaimed.usd_total) AS sum
           FROM incomes_claimed_and_unclaimed
          WHERE (((incomes_claimed_and_unclaimed.category)::text = 'claimed'::text) AND ((incomes_claimed_and_unclaimed.recipient)::text = (historic_incomes.recipient)::text))), (0)::numeric) AS usd_claimed,
    COALESCE(( SELECT sum(incomes_claimed_and_unclaimed.usd_total) AS sum
           FROM incomes_claimed_and_unclaimed
          WHERE (((incomes_claimed_and_unclaimed.category)::text = 'unclaimed'::text) AND ((incomes_claimed_and_unclaimed.recipient)::text = (historic_incomes.recipient)::text))), (0)::numeric) AS usd_unclaimed,
    avg(historic_incomes.exchange_rate) AS exchange_rate
   FROM incomes_claimed_and_unclaimed historic_incomes
  GROUP BY historic_incomes.recipient, historic_incomes.election
  ORDER BY historic_incomes.election;
