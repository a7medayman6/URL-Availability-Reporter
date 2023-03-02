const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user')


/* @desc Register a new User. */
router.post('/register', async(req, res) => 
{
    // Parse user data
    const { name, email, password } = req.body;
    const verified = false;

    console.log(name, email, password)

    // Validate user data
    if (!name || !email || !password) 
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    

    if (!/\S+@\S+\.\S+/.test(email)) 
        return res.status(400).json({ error: 'Invalid email format.' });
    

    if (password.length < 8) 
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    
    
    try
    {
        // Check if user with email already exists
        const existingUser = await User.findOne({ email })

        if (existingUser) 
            return res.status(400).json({ error: 'User with this email already exists.' });
          
        // Create a new user object
        const user = new User({ name, email, password, verified });

        // Save the user to the database
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(201).json({ message: 'User created successfully', userId: user._id, token: token });
    }
    catch(err)
    {
        console.error("[ERROR | Auth]", err);
        res.status(500).json({ error: 'Server error' });
    }
    
})

/* @desc Login using a User Creds. */
router.get('/login', async(req, res) => 
{
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) 
      return res.status(400).json({ error: 'Please provide email and password.' });
    
    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    
    try
    {
        // Find the user by email in the database
        const user = await User.findOne({ email })
          
        if (!user) 
            return res.status(400).json({ error: 'Invalid credentials.' });
        
        // Compare the password provided by the user with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) 
            return res.status(400).json({ error: 'Invalid credentials.' });

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        // Return the token to the client
        res.status(200).json({ message: "Successfull login.", userId: user._id, token: token });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({ error: 'Server error' });    
    }

})

module.exports = router