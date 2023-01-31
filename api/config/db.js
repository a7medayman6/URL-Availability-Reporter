const mongoose = require('mongoose');

const connectDB = async() => 
{
    try
    {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`Mongodb Connected to ${conn.connection.host}:${conn.connection.port} ${conn.connection.db.name}`.cyan.underline );
    }
    catch(err)
    {
        console.error(err);
        process.exit(1);
    }
}

module.exports = {connectDB, }