const express = require('express');
const route = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../model/User')

//post user
route.post('/',
    [
        check('name', 'name is reqiured').notEmpty(),
        check('email', 'email is invalid').isEmail(),
        check('password', 'password must be required min length 6').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        
        //user register
        const { name, email, password } = req.body;
        try {
            const userml = await User.findOne({ email });
            // user exists
            if (userml) {
                return res.status(400).json({ errors: [{ msg: 'email if already exists' }] });
            }
            // use gravartar 
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'rd',
                d: 'mm'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });
            // bcryt password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();
            //return jwtokens
            const payload = { 
                user: {
                    id: user.id,
                    name: user.name
                } 
            }
            jwt.sign(
                payload, 
                config.get('jwtToken'), 
                { expiresIn: 360000 },
                (err, token) => {
                    if(err) throw err;
                    res.json({ token });
                }
            );
            
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('server Error');
        }
    });


module.exports = route;



