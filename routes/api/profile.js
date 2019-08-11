const express = require(`express`);
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Test route
// @access  Private
router.get(`/me`, auth, async (req, res) => {
    try {
        // The Profile schema contains a field named 'user,' which stores a user object based on the User schema.
        // Populate means we populate from user property, and the 2nd argument is the fields we want form the stored user object.
        // Otherwise, sends entire profile, with the added populate fields 'name' and 'avatar.'
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user', 
            ['name','avatar']
        );

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user.' });
        }

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Create or update a user profile
// @access  Private
router.post('/', [ auth , [
    check('status', 'Status is required.')
        .not()
        .isEmpty(),
    check('skills', 'Skills is required.')
        .not()
        .isEmpty() 
    ]
], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // build profile objecct
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        // turn comma separated list (skills) into an array with .split(), and a comma as the delimiter. 
        // The array will be composed of skills that are properly trimmed of unecessary whitespace.
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    }

    // build social object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try {
        // req.user.id is set in auth middleware, which assigns user based on passed token.
        let profile = await Profile.findOne({ user: req.user.id });
        if(profile) { // Profile found? Then Update an existing one
            // update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true}
            );

            return res.json(profile);
        }

        // or Create one that's new
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile)
    } catch(error) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
})

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name','avatar']);
        
        if(!profile) return res.status(400).json({ msg: 'Profile not found.' })
        
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        // fishing for certain type of error
        if(err.kind == "ObjectId") {
            return res.status(400).json({ msg: 'Profile not found. '});
        }
        res.status(500).send('Server Error.');
    }
});

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // @todo - remove users posts

        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User has been deleted.'});
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience', [ 
    auth, 
    [
        check('title', 'Title is required.')
        .not()
        .isEmpty(),
        check('company', 'Company is required')
        .not()
        .isEmpty(),
        check('from', 'From is required')
        .not()
        .isEmpty()
    ]
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // pushes onto beginning rather than the end; most recent experience objects come first.
        profile.experience.unshift(newExp);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error.');
    }

});

module.exports = router;