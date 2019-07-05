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

