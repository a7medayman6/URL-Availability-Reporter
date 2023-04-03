const mongoose = require('mongoose');


const reportSchema = new mongoose.Schema(
    {
        userId:     { type: String, required: true },
        checkId:    { type: String, required: true },
        status:     { type: Boolean, default: false },  /**The current status of the URL. */
        availability: { type: Number, default: 0 },     /**A percentage of the URL availability. */
        outages:    { type: Number, default: 0 },       /**The total number of URL downtimes. */
        downtime:   { type: Number, default: 0 },       /**The total time, in seconds, of the URL downtime. */
        uptime:     { type: Number, default: 0 },       /**The total time, in seconds, of the URL uptime. */
        responseTime: { type: Number, default: 0 },     /**The average response time for the URL. */
        history:    { type: String, default: "" },      /**Timestamped logs of the polling requests. */
        totaltime:  { type: Number, default: 0 },
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

const Report = mongoose.model('Report', reportSchema);


module.exports = Report;