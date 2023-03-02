const express = require('express');
const router = express.Router();

const { registerController, loginController } = require('../controllers/auth')



/* @desc Register a new User. */
router.post('/register', registerController)

/* @desc Login using a User Creds. */
router.get('/login', loginController)

module.exports = router