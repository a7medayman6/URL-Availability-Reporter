const express = require('express');
const router = express.Router();
const Authenticate = require('../middleware/authenticate');
const { 
    getAllChecks,
    getCheckById, 
    createNewCheck, 
    updateCheckById, 
    deleteCheckById, 
    deleteAllUserChecks, 
    getUserChecks } = require('../controllers/check');


// Define endpoint to get all checks
router.get('/', Authenticate, getAllChecks);

// Define endpoint to get specific check by id
router.get('/:id', Authenticate, getCheckById);

// Define endpoint to create a new check
router.post('/', Authenticate, createNewCheck);

// Define endpoint to update a specific check by id
router.put('/:id', Authenticate, updateCheckById);
 
// Define endpoint to DELETE check by ID
router.delete('/:id', Authenticate, deleteCheckById);


// DELETE all checks created by a specific user
router.delete('/', Authenticate, deleteAllUserChecks);

// Define endpoint to get all checks for a specific user
router.get('/user/:userId', Authenticate, getUserChecks);


  
module.exports = router;