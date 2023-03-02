const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema(
    {
        name:       { type: String, required: true },
        email:      { type: String, required: true, unique: true },
        password:   { type: String, required: true },
        verified:   { type: Boolean }, 
    },
    { 
        collation:  {            
                        locale: 'en_US',
                        caseLevel: true,
                        strength: 2
                    } 
    },
    {
        timestamps: true,
        collation: { locale: 'en_US', strength: 1 },
    }
)

// Hash the password before saving it to the database
userSchema.pre('save', async function(next) 
{
    const user = this;
  
    if (!user.isModified('password')) 
      return next();

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();

  });

const User = mongoose.model('User', userSchema);


module.exports = User;