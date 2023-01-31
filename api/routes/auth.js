const express = require('express');
const router = express.Router();


/* @desc Register a new User. */
router.get('/register', async(req, res) => 
{
    console.log("[LOG | Auth]", req.body);

    try
    {
        // parse user data
        // validate user data
        // create user
    }catch(err)
    {

    }
    
    res.status(200).json({ Ok: true, msg: "Register ... " })
})

/* @desc Login using a User Creds. */
router.get('/login', (req, res) => 
{
    res.status(200).json({ Ok: true, msg: "Login ..." })
})

module.exports = router