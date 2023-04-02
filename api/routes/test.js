const express = require('express');
const router = express.Router();

router.get('/', (req, res) => 
{
    res.status(200).json({data: { status: 'ok', msg: "Your API is up and running .."} })
})


module.exports = router