CREATE OR REPLACE VIEW "public"."incomes_by_delegate" AS
SELECT 
recipient,
sum(eos_claimed) as eos_claimed,
sum(eos_unclaimed) as eos_unclaimed,
sum(usd_claimed) as usd_claimed,
sum(usd_unclaimed) as usd_unclaimed
FROM historic_incomes
GROUP BY recipient;
