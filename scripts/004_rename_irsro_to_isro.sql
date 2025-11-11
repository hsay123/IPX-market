-- Update any dataset title containing 'irsro' (case insensitive) to 'ISRO'
UPDATE datasets 
SET title = REPLACE(title, 'irsro', 'ISRO')
WHERE LOWER(title) LIKE '%irsro%';

UPDATE datasets 
SET title = REPLACE(title, 'IRSRO', 'ISRO')
WHERE LOWER(title) LIKE '%irsro%';

-- Also update descriptions if they contain irsro
UPDATE datasets 
SET description = REPLACE(description, 'irsro', 'ISRO')
WHERE LOWER(description) LIKE '%irsro%';

UPDATE datasets 
SET description = REPLACE(description, 'IRSRO', 'ISRO')
WHERE LOWER(description) LIKE '%irsro%';
