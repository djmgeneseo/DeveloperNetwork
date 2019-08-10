const express = require(`express`);
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const config = require('config');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route that uses custom auth middleware.
// @access  Public
router.get(`/`, auth, async (req, res) => {
    try {
        /** 
         * Already added the 'user' key/value to req object in auth middleware, 
         * so we're invoking it again here as an argument 'req.user.id'. 
         * 
         * select('-password') removes password from the query. 
        */ 
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user; generate the token. Email and password are required.
// @access  Public
router.post(
    `/`, [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').exists()
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) { // if there are errors
            return res.status(400).json({ errors: errors.array() }); // 400 = bad request
        }

        // User sends valid registration information
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email }); // returns a promise, need await
            if(!user) { // Check if user DOES NOT exist; return error
                // The json is formatted to match the validation error format for consistency
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]});
            }

            // Make sure the passwords match
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]});
            }

            // CREATE & RETURN JSON WEB TOKEN
            const payload = {
                user: {
                    id: user.id
                }
            }

            // expiresIn is in seconds
            jwt.sign(
                payload,
                config.get('jwtSecret'), 
                {expiresIn: 360000},
                (err, token) => {
                    if(err) throw err;
                    res.json({token});
                });

            //res.send('User registered')
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
});

module.exports = router;