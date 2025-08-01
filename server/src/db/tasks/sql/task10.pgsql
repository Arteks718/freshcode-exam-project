WITH transactions AS (
  SELECT users.id, SUM(contests.prize) AS total_prize, balance 
  FROM "Users" as users
  INNER JOIN "Contests" as contests ON users.id = contests."userId"
  WHERE users.role = 'customer'
    AND
    contests."status" = 'finished'
    AND
    contests."createdAt" BETWEEN '2024-12-25' AND '2025-01-14'
  GROUP BY users.id
)
UPDATE "Users" as users
SET balance = users.balance + transactions.total_prize * 0.1
FROM transactions
WHERE users.id = transactions.id