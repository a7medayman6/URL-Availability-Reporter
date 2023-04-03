const mongoose = require('mongoose');


const checkSchema = new mongoose.Schema(
    {
        userId:     { type: String, required: true },
        name:       { type: String, required: true },   /** The name of the check. */
        url:        { type: String, required: true},    /** The URL to be monitored.*/
        protocol:   { type: String, enum: ['http', 'https', 'tcp'], required: true, default: 'https'}, /**The resource protocol name `HTTP`, `HTTPS`, or `TCP`. */
        path:       { type: String },                   /**A specific path to be monitored *(optional)*. */
        port:       { type: Number },                   /**The server port number *(optional)*. */
        webhook:    { type: String },                   /**A webhook URL to receive a notification on *(optional)*. */
        timeout:    { type: Number, default: 5 },       /***(defaults to 5 seconds)*: The timeout of the polling request *(optional)*. */
        interval:   { type: Number, default: 10 },      /***(defaults to 10 minutes)*: The time interval for polling requests *(optional)*. */
        threshold:  { type: Number, defualt: 1 },       /***(defaults to 1 failure)*: The threshold of failed requests that will create an alert *(optional)*. */
        authentication: {                               /**An HTTP authentication header, with the Basic scheme, to be sent with the polling request *(optional)*. */
                            username: { type: String },
                            password: { type: String }
                        },
        httpHeaders:    { type: Array, default: [] },   /**A list of key/value pairs custom HTTP headers to be sent with the polling request (optional). */
        assert:     {                                   /**The response assertion to be used on the polling response (optional). */
                        statusCode: { type: Number, default: 200 }, /**An HTTP status code to be asserted. */
                    },
        tags:       { type: Array, default: [] },       /**A list of the check tags (optional). */
        ignoreSSL:   { type: Boolean, default: false }, /**A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol. */


    },
    { 
        timestamps: true,
        collation:  {            
                        locale: 'en_US',
                        caseLevel: true,
                        strength: 2
                    } 
    },
        
)

const Check = mongoose.model('Check', checkSchema);


module.exports = Check;