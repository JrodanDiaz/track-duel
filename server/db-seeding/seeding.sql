\echo 'Seeding database'

INSERT INTO 
    users (
        username,
        passhash
    ) 
VALUES
    (
        'jordan',
        'jordan'
    ),
    (
        'bourbon',
        'bourbon'
    ),
    (
        'pge',
        'pge'
    );

\echo 'finished seeding db GOD'
SELECT * FROM users