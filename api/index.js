const express = require('express');
const colors = require('colors')
const morgan = require('morgan')

const db = require('./config/db')

require('dotenv').config();

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// loggers
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms -  :body - :req[content-length]  - :res[content-length]'));




// routes
app.use('/api/v1/test', require('./routes/test'))
app.use('/api/v1/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => 
{    
    console.log(`[LOG | index] Server Started at ${PORT}`)
})
