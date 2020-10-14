const jwt = require('jsonwebtoken');
const config = require('config');



module.exports = async (req, res, next) =>{
    // get token headers
    const token = req.header('x-auth-token');
    //token not valid
    if(!token){
        return res.status(401).json({ msg : 'token access denied'});
    }

    try{
        //token verify
        const decoded = jwt.verify(token, config.get('jwtToken'));

        req.user = decoded.user;
        next();
    } catch(err){
        console.log(err.message);
        res.status(401).json({ msg : 'Token is Not Valid'});
    }
    
}