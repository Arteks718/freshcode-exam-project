WITH transactions AS (
  SELECT users.id, SUM(contests.prize) AS total_prize, balance 
  FROM "Users" as users
  INNER JOIN "Contests" as contests ON users.id = contests."userId"
  WHERE users.role = 'customer'
    AND
    contests."status" = 'finished'
    AND
    contests."createdAt" 
      BETWEEN 
        make_date(CAST (EXTRACT (year from current_date) as integer ) - 1, 12, 25 )
      AND
        make_date(CAST (EXTRACT (year from current_date) as integer ), 1, 30 )
  GROUP BY users.id
)
UPDATE "Users" as users
SET balance = transactions.total_prize * 0.1
FROM transactions
WHERE users.id = transactions.id