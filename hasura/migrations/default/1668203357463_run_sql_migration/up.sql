CREATE OR REPLACE VIEW "public"."expenses_by_delegate" AS 
 SELECT categorized_expenses_by_delegate.delegate_payer,
    sum(categorized_expenses_by_delegate.amount) AS amount,
    sum(categorized_expenses_by_delegate.usd_total) AS usd_total
   FROM categorized_expenses_by_delegate
   where categorized_expenses_by_delegate.category <> 'uncategorized'
  GROUP BY categorized_expenses_by_delegate.delegate_payer
  ORDER BY categorized_expenses_by_delegate.delegate_payer;
