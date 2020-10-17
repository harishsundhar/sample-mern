const express = require('express');

const route = express.Router();
const Auth = require('../../middleware/auth');
const User = require('../../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
//Auth user
    route.get('/', Auth, async (req,res)=>{
        try{
            const user = await User.findById(req.user.id).select('-password');
            res.json(user)
        }catch(err){
            console.log(err.message);
            res.status(500).send('server error');       
        }
    });

//user Login Email and password
    route.post('/',
        [
            check('email', 'email is invalid').isEmail(),
            check('password', 'Password is required').exists()
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() });
            }
            
            //user mail account valid
            const {  email, password } = req.body;
            try {
                const userml = await User.findOne({ email });
                
                // user exists
                if (!userml) {
                    return res.status(400).json({ error: [{ msg: 'Invalid Credentials' }] });
                }
                
                const psMatch = await bcrypt.compare(password, userml.password);
                
                if(!psMatch){
                    return res.status(400).json({ error: [{ msg: 'Invalid Credentials' }] });
                }
                //return jwtokens
                const payload = { 
                    user: {
                        id: userml.id
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