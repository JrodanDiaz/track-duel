\echo 'creating users table'

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    passhash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS playlists (
    playlist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    playlist_url VARCHAR(2048) NOT NULL
);

\echo 'Finished creating users table'
\dt
