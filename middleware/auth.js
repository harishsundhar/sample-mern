const jwt = require('jsonwebtoken');
const config = require('config');



module.exports = async (req, res, next) =>{
    // get token headers
    const token = req.header('x-auth-header');
    //token not valid
    try{
        if(!token){
            res.status(401).json({ msg : 'token access denied'});
        }
        //token verify
        const decoded = jwt.verify(token, config.get('jwtToken'));

        req.user = decoded.user;
        next();
    } catch(err){
        console.log(err.message);
        res.status(401).json({ msg : 'Token is Not Valid'});
    }
    
}