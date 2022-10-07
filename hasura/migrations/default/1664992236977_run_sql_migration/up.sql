CREATE OR REPLACE VIEW "public"."total_by_category" AS 
SELECT eden_transaction.category,
    sum(eden_transaction.amount) AS amount,
    sum(eden_transaction.usd_total) AS usd_total,
    eden_transaction.type
  FROM eden_transaction
  GROUP BY eden_transaction.category, eden_transaction.type
  order by eden_transaction.type;
