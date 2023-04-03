const mongoose = require('mongoose');
const Check = require('../models/check');
const Authenticate = require('../middleware/authenticate');
const Cron = require('../services/cron')

const getAllChecks = async (req, res) => 
{
    try 
    {
        const checks = await Check.find({});
        res.status(200).json({checks: checks});
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error.' });
    }
}

const getCheckById = async (req, res) => 
{
    const id = req.params.id;

    try 
    {
        const check = await Check.findById(id);
        if(!check)
            return res.status(404).json({  error: "There isn't a Check with the provided id."  })

        // Ensure that the user is the owner of the check
        if (check.userId !== req.user._id.toString()) 
            return res.status(401).json({ error: 'Unauthorized.' });
            
        
        res.status(200).json({check: check});
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
}

const createNewCheck = async (req, res) => 
{
    try 
    {
        const { name, url, protocol, path, port, webhook, timeout, interval, threshold, authentication, httpHeaders, assert, tags, ignoreSSL } = req.body;
        const userId = req.user._id;

        const newCheck = new Check(
        {
            userId,
            name,
            url,
            protocol,
            path,
            port,
            webhook,
            timeout,
            interval,
            threshold,
            authentication,
            httpHeaders,
            assert,
            tags,
            ignoreSSL,
        });
        await newCheck.save();
        await new Cron().createJob(newCheck);
        res.status(201).json({check: newCheck});
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error.' });
    }
}


const updateCheckById = async (req, res) => 
{
    const id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(400).json({ message: 'Invalid check ID.' });
    
    const { name, url, protocol, path, port, webhook, timeout, interval, threshold, authentication, httpHeaders, assert, tags, ignoreSSL } = req.body;
    
    const userId = req.user._id;

    try 
    {
        const updatedCheck = await Check.findOneAndUpdate(
            { _id: id, userId: userId },
            { name, url, protocol, path, port, webhook, timeout, interval, threshold, authentication, httpHeaders, assert, tags, ignoreSSL },
            { new: true }
        );
        
        if (!updatedCheck) 
            return res.status(404).json({ error: 'Check not found.' });
        
        // Ensure that the user is the owner of the check
        if (updatedCheck.userId !== req.user._id.toString()) 
            return res.status(401).json({ error: 'Unauthorized.' });
            
        
        res.sendStatus(204);

    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const deleteCheckById = async (req, res) => 
{
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(400).json({ error: 'Invalid check ID.' });
    
  
    try 
    {
        const check = await Check.findById(id);
        if (!check)
            return res.status(404).json({ error: 'Check not found.' });
        
    
        // Ensure that the user is the owner of the check
        if (check.userId !== req.user._id.toString()) 
            return res.status(401).json({ error: 'Unauthorized.' });
        
    
        await Check.findByIdAndDelete(id);
        res.status(204).send({ message: 'Deleted The Check Successfully.'});
    } 
    catch (err) 
    {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }

}

const deleteAllUserChecks = async (req, res) => 
{
    const userId = req.user._id;
    
    try 
    {
        // Delete all checks that belong to the user
        await Check.deleteMany({ userId: userId });
    
        res.status(200).send({ message: 'All checks deleted successfully' });
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

const getUserChecks = async (req, res) => 
{
    const userId = req.params.userId;

    try 
    {
        const checks = await Check.find({ userId: userId });
        res.status(200).json({checks: checks});
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
}


module.exports =    { 
                        getAllChecks, 
                        getCheckById, 
                        createNewCheck, 
                        updateCheckById, 
                        deleteCheckById, 
                        deleteAllUserChecks, 
                        getUserChecks 
                    };