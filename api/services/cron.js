const cron = require("node-cron");
const axios = require("axios");
const axiosTime = require("axios-time");

const Report = require("../models/report");
const Check = require("../models/check");


axiosTime(axios);


class Cron
{
    createJobsForExistinChecks = async() =>
    {
        try 
        {
            const checks = await Check.find({});
            checks.forEach(async(check) =>
            {
                this.createJob(check);
            });
        } 
        catch (err) 
        {
            console.log(`[Error | Cron | createJobsForExistinChecks] ${err}`);
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

    ping = async(check) =>
    {
        let reportStatus = await this.isExists(check);
        let checkStatus = await this.isUp(check);

        if(reportStatus.exists && reportStatus.report != null)
        {
            console.log(`[Log | Cron | ${check.name} | ping] Report Exist, Updating it ...`)
            await this.updateReport(check, checkStatus, reportStatus.report);
        }
        else
        {
            console.log(`[Log | Cron | ${check.name} | ping] Report Doesn't Exist, Creating it ...`)
            await this.createReport(check, checkStatus)
        }
    }

    updateReport = async(check, checkStatus, report) =>
    {
        let downTime = checkStatus.up ? report.downtime : report.downtime + check.interval;
        let upTime = checkStatus.up ? report.uptime + check.interval : report.uptime;
        let totalTime = report.totaltime + check.interval;
        
        try
        {
            
            var updatedReport = await Report.findOneAndUpdate(
                { 
                    checkId: check._id, 
                    userId: check.userId 
                },
                { 
                    status: checkStatus.up, 
                    availability: Math.floor((upTime * 100) / totalTime), 
                    downtime: downTime,
                    uptime: upTime, 
                    totaltime: report.totaltime + check.interval,
                    outages: checkStatus.up ? report.outages : report.outages + 1, 
                    history: checkStatus.up ? 
                    `Successfull Request - Type: GET, Status: ${checkStatus.status}, Response Time: ${checkStatus.time}.` : 
                    `Failed Request - Type: GET, Status: ${checkStatus.status}, Response Time: ${checkStatus.time}.`
                })
                .clone()
                .then((res) => 
                {
                    console.log(`[Log | Cron | ${check.name} | updateReport] Update the Report.`);
                    return res;
                });
        }
        catch(err)
        {
            console.log(`[Error | Cron | ${check.name} | updateReport] ${err}`);
        }
    }

    createReport = async(check, checkStatus) =>
    {
        try
        {

            var createdReport = new Report(
                {
                    checkId:    check._id,
                    userId:     check.userId,
                    status:     checkStatus.up, 
                    availability: checkStatus.up ? 100 : 0, 
                    downtime:   checkStatus.up ? 0 : check.interval, 
                    uptime:     checkStatus.up ? check.interval : 0, 
                    totaltime:  check.interval,
                    outages:    checkStatus.up ? 0 : 1, 
                    history:    checkStatus.up ? 
                    `Successfull Request - Type: GET, Status: ${checkStatus.status}, Response Time: ${checkStatus.time}.` : 
                    `Failed Request - Type: GET, Status: ${checkStatus.status}, Response Time: ${checkStatus.time}.`
                });

                createdReport
                    .save()
                    .then((res) => 
                    {
                        console.log(`[Log | Cron | ${check.name} | createReport] Created a new Report.`);
                        return res;
                    })
                    
        }
        catch(err)
        {
            console.log(`[Error | Cron | ${check.name} | createReport] ${err}`);
        }
    }

    isExists = async(check) =>
    {   
        try
        {
            return await Report.findOne({ checkId: check._id }, (err, result) =>
            {   
                if(err)
                throw err;
            })
            .clone()
            .then((res) => 
            {
                let exists = res? true : false;
                return { exists: exists, report: res }
            })
            .catch((err) => 
            {
                console.log(`[Error | Cron | ${check.name} | isExists] ${err}`);
                return { exists: false, report: null };
            });

        }
        catch(err)
        {
            console.log(`[Error | Cron | ${check.name} | reportExists] ${err}`)
            return { exists: false, report: null }
        }
    }

    isUp = async (check) =>
    {
        let portString = check.port ? ":" + check.port : ""
        let URL = check.protocol + "://" + check.url + portString + check.path
        
        console.log(`[Log | Cron | ${check.name} | isUp] Pinging ${URL} to Update its report ...`)

        try
        {
            return await axios
                .get(URL)
                .then(async (res) => 
                {
                    let responseTime = res.timings.elapsedTime;
                    let responseStatusCode = res.status;
                    let up = responseStatusCode == check.assert.statusCode
                    console.log(`[LOG | Cron | ${check.name}] Response Status: ${responseStatusCode}`);
                    
                    return {up: up , status: responseStatusCode, time: responseTime}
                });
        }
        catch(err)
        {
            console.log(`[Error | Cron | ${check.name} | isUp] ${err}`)
            return {up: false , status: 1000, time: 10}
        }

    }
}


module.exports = Cron;