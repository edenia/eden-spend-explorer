CREATE OR REPLACE VIEW total_expense_by_election_view AS
SELECT id_election, SUM(eos_amount) AS total_eos_amount, SUM(usd_amount) AS total_usd_amount
FROM total_expense_by_delegate_and_election
GROUP BY id_election;