const cron = require("node-cron");
const axios = require("axios");
const Report = require("../models/report");
const axiosTime = require("axios-time");


axiosTime(axios);

class Cron 
{
    static queue = []

    ping = async(check) => 
    {   
        let portString = check.port ? ":" + check.port : ""
        let URL = check.protocol + "://" + check.url + portString + check.path
        console.log(`[Log | Cron | ${check.name}] Pinging ${URL} to Update its report ...`)
        try
        {
            /**Ping the URL, and update the report.*/
            return await axios
                .get(URL)
                .then(async (res) => 
                    {

                        let responseTime = res.timings.elapsedTime;
                        let responseStatus = res.status;
                        console.log(`[LOG | Cron | ${check.name}] Response Status: ${responseStatus}`);
                        
                        let reportToUpdate = await Report.findOne({ checkId: check.id }, (err, result) =>
                        {   
                            if(err)
                                throw err;
                        })
                        .clone()
                        .catch((err) => console.log(`[Error | Cron | ${check.name}] ${err}`)) 

                        let exists = true
                        if(!reportToUpdate)
                            exists = false;

                        if(responseStatus == check.assert.statusCode)
                        {  
                            console.log(`[Log | Cron | ${check.name}] Status Code: ${responseStatus}.`)
                            console.log(`[Log | Cron | ${check.name}] Updating its report ...`)
                            if(exists) console.log(`[Log | Cron | ${check.name}] Report Exist ...`)
                            else console.log(`[Log | Cron | ${check.name}] Report deosn't exist, Creating it ...`)
                            /**Update the report or create it with up: true */

                            console.log(`[LOG | Cron | ${check.name}] Report to Update: ${reportToUpdate}`)
                            var status = true;
                            var downTime = exists ? reportToUpdate.downtime : 0;
                            var upTime = exists ? reportToUpdate.uptime + 10 : 10;
                            var totalTime = exists ? reportToUpdate.totalTime + 10 : 10; 
                            var availability = exists ? Math.floor((upTime * 100) / totalTime) : 100;


                            var outages = exists ? reportToUpdate.outages : 0;
                            var history = `Successfull Request - Type: GET, Status: ${res.status}, Response Time: ${responseTime}.`;
                            
                            
                        }    
                        else
                        {
                            /**Update the report or create it with up: false */
                             
                            var status = false;
                            var downTime = exists ? reportToUpdate.downtime + 10: 0;
                            var upTime = exists ? reportToUpdate.uptime : 0;
                            var totalTime = exists ? reportToUpdate.totalTime + 10 : 10; 
                            var availability = exists ? Math.floor((upTime * 100) / totalTime) : 0;
                            
                            console.log(`[Log | Cron | ${check.name}] Availability: ${availability}.`)

                            var outages = exists ? reportToUpdate.outages + 1 : 1;
                            var history = `Failed Request - Type: GET, Status: ${res.status}, Response Time: ${responseTime}.`;
                            
                        }
                        
                        if(exists)
                        {

                            var updatedReport = await Report.findOneAndUpdate(
                                { 
                                    checkId: check._id, 
                                    userId: check.userId 
                                },
                                { 
                                status: status, 
                                availability: availability, 
                                downTime: downTime, 
                                upTime: upTime, 
                                totalTime: totalTime,
                                outages: outages, 
                                history: history
                            },
                            { 
                                new: true 
                            },
                            ).clone().then(() => console.log('Updated report'));
                        }
                        else
                        {
                            var updatedReport = new Report(
                                {
                                    checkId: check._id,
                                    userId:check.userId,
                                    status: status, 
                                    availability: availability, 
                                    downTime: downTime, 
                                    upTime: upTime, 
                                    totalTime: totalTime,
                                    outages: outages, 
                                    history: history
                                }
                            )
                            updatedReport.save().then(() => console.log('Creating new Report report'));
                        }    
                        return updatedReport;
                    })
                
        }
        catch(err) 
        {
            console.log(err);
        }
    } 

    createJob = async(check) =>
    {
        console.log(`[Log] Creating a Cron job for check ${check.name} ...`)
        cron.schedule(`*/5 * * * * *`, async () => 
        {
            this.ping(check);
        });
    }
}

// module.exports = Cron;