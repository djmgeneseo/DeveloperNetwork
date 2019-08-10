'config' npm dependency - create config directory and store global variables in default.json.

Convention: 
- don't use app.get for routes; instead, use:
    app.use('/api/users', require('./routes/api/users'));
- capitalize files that represent db models
- res.send({ hello: "world" }) transforms response header's Content-Type to application/json automatically. 
- res.json() also calls res.send() under the hood
- res.end is useful for 404 statuses, but functions the same as res.send():         
    res.status(404).end();
- In request header, for routes that require authentication, server expects
        x-auth-token: <javascript web token value here>

Dependencies:
- Passport.js is not included; it's a middleware for user validation. Unecessary and heavy; useful for incorporating FaceBook and Twitter login etc.

How it works:
- Comparing plaintext password with hashed + salted password: Salt is concatenated to the end of a hashed password. The salt is incorporated into the hash (as plaintext). The compare function simply pulls the salt out of the stored hash and then uses it to compare the recently passed and now hashed password and perform the comparison. It doesn't matter if the attacker knows the salt for any particular hash, it's not a secret. Using a different salt for each password means the attacker can't precompute hashes using common values. With a different salt on each one, they would need to recompute any tables for every password which makes them useless.