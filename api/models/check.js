const mongoose = require('mongoose');


const checkSchema = new mongoose.Schema(
    {
        userId:     { type: String, required: true },
        name:       { type: String, required: true },
        url:        { type: String, required: true},
        protocol:   { type: String, enum: ['http', 'https', 'tcp'], required: true, default: 'https'},
        path:       { type: String }, 
        port:       { type: Number },
        webhook:    { type: String },
        timeout:    { type: Number, default: 5 },
        interval:   { type: Number, default: 10 },
        threshold:  { type: Number, defualt: 1 },
        authentication: { 
                            username: { type: String },
                            password: { type: String }
                        },
        httpHeaders:    { type: Array, default: [] },
        assert:     {
                        statusCode: { type: Number, default: 200 },
                    },
        tags:       { type: Array, default: [] },
        ignoreSSL:   { type: Boolean, default: false },


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

const Check = mongoose.model('Check', checkSchema);


module.exports = Check;