const jwt = require('jsonwebtoken');
const User = require('../models/user');

const Authenticate = async (req, res, next) => 
{
    try 
    {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ _id: decoded.userId });
        
        if (!user) 
            throw new Error();
        
        req.token = token;
        req.user = user;
        next();
    } 
    catch (error) 
    {
        console.log(error);
        res.status(401).send({ error: 'Not authorized to access this resource.' });
    }
};
  
module.exports = Authenticate;
