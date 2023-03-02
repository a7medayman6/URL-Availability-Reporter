const mongoose = require('mongoose');
require('dotenv').config();
 
const connectionString = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

mongoose.connect(connectionString, 
    {
        useNewUrlParser: true,
    })
.then(() => console.log(`[LOG | db] Connected to MongoDB at ${process.env.MONGODB_URI}`))
.catch(err => console.log(err));

module.exports = mongoose.connection;
