\echo 'Seeding database'

INSERT INTO 
    users (
        username,
        passhash
    ) 
VALUES
    (
        'jordan',
        'Shrekt123'
    ),
    (
        'bourbon',
        'Necromancy'
    );

\echo 'finished seeding db GOD'
SELECT * FROM users