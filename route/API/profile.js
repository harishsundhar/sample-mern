const { json } = require('express');
const express = require('express');
const config = require('config');
const request = require('request');
const auth = require('../../middleware/auth');
const route = express.Router();
const Profile = require('../../model/Profile');
const User = require('../../model/User');
const { check, validationResult } = require('express-validator');

// get api/profile/me
route.get('/me',auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id}).populate('user', ['name', 'avatar']);
        console.log(profile);
        if(!profile){
            return res.status(400).json({ msg: "there is no profile for this user"});
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

//posts update and find

route.post('/',auth, 
    [
        check('status','status is required' ).notEmpty(),
        check('skills', 'skills is required').notEmpty()
    ], async (req, res)=> {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.array() });
        }
         
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubname,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin 
    } = req.body;

    const profileFields = {}

    //build profile objects
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubname) profileFields.githubname = githubname;
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //build social profile
    profileFields.social = {}

    if(youtube) profileFields.social.youtube = youtube;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(facebook) profileFields.social.facebook = facebook;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        console.log(profile);
        if(profile){
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new : true}
            );
            return res.json(profile);
        }

        //not user create
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err.messasge);
        res.status(500).send('Server error');
    }
});


// get all users
route.get('/', async(req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['user, avatar']);
        console.log(profiles);
        res.json(profiles);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// get all user/:user_id
route.get('/user/:user_id', async(req, res) => {
    try {
        const profile = await Profile.find({ user: req.params.user_id }).populate('user', ['user, avatar']);
        console.log(profile);
        if(!profile){
            return res.status(400).json({ msg : "Profile Not found"});
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if(err.kind == 'Objectid'){
            return res.status(400).json({ msg : "Profile Not found"});
        }
        res.status(500).send('Server Error');
    }
});

// Delete user and profile
route.delete('/',auth, async(req, res) => {
    try {
        //delete profile
        await Profile.findOneAndDelete({ user: req.user.id }).populate('user', ['user, avatar']);
        //delete user
        await User.findOneAndDelete({ _id: req.user.id }).populate('user', ['user, avatar']);

        res.json({ msg: 'User is Deleted' });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//add experience
route.put('/experience',
    [   auth,
        [
            check('title', 'title is required').notEmpty(),
            check('company', 'company is required').notEmpty(),
            check('from', 'fromDate is required').notEmpty()
        ]
    ], async (req,res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array() });
        }

        const experience = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body

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
            console.log(profile);
            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
});
//Delete experience
route.delete('/experience/:exp_id', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //delete user
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//add education
route.put('/education',
    [   auth,
        [
            check('school', 'school is required').notEmpty(),
            check('degree', 'degree is required').notEmpty(),
            check('fieldofstudy', 'fieldofstudy is required').notEmpty()
        ]
    ], async (req,res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array() });
        }

        const education = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body

        const newedu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            console.log(profile);
            profile.education.unshift(newedu);

            await profile.save();

            res.json(profile);

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
});
//Delete education
route.delete('/education/:edu_id', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //delete user
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//GET github repos
route.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/
            ${req.params.username}/repos?per_page=5&sort=created:asc
            &client_id=${config.get('githubClientid')}&
            client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent' : 'node.js'}
        };
        console.log(options);
        request(options, (error, response, body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200){
                return res.status(400).json({ msg : 'No github profile found'});
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = route;