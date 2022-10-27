CREATE OR REPLACE VIEW "public"."expenses_by_delegate" AS
select
delegate_payer,
sum(amount) as amount,
sum(usd_total) as usd_total
from categorized_expenses_by_delegate
group by delegate_payer
order by delegate_payer;
