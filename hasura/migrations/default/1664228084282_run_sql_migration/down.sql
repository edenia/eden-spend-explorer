-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE VIEW "public"."incomes_claimed_or_unclaimed" as
-- select
-- recipient, election,
-- (coalesce((select sum(amount) from
-- incomes_claimed_and_unclaimed where category='claimed' and recipient=historic_incomes.recipient), 0)) as eos_claimed,
-- (coalesce((select sum(amount) from
-- incomes_claimed_and_unclaimed where category='unclaimed' and recipient=historic_incomes.recipient), 0)) as eos_unclaimed,
-- (coalesce((select sum(usd_total) from
-- incomes_claimed_and_unclaimed where category='claimed' and recipient=historic_incomes.recipient),0)) as usd_claimed,
-- (coalesce((select sum(usd_total) from
-- incomes_claimed_and_unclaimed where category='unclaimed' and recipient=historic_incomes.recipient), 0)) as usd_unclaimed,
-- avg(exchange_rate) as exchange_rate
-- from incomes_claimed_and_unclaimed as historic_incomes
-- group by recipient, election
-- order by election;
