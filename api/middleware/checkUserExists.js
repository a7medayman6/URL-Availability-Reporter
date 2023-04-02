const User = require('../models/user');

async function checkUserExists(req, res, next) 
{
    try 
    {
        const user = await User.findById(req.body.userId);
        if (!user) 
            return res.status(404).json({ error: "User not found, Please provide a valid userId." });
        
        next();
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = checkUserExists;