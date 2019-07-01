const express = require(`express`);
const router = express.Router();

// @route   POST api/users
// @desc    Register user. Needs name, email, and password
// @access  Public
router.post(`/`, (req, res) => {
    console.log(req.body);
    res.send('User route')
});

module.exports = router;