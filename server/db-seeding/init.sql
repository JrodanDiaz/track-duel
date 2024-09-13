\echo 'creating users table'

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    passhash VARCHAR(255) NOT NULL
);

\echo 'Finished creating users table'
\dt
