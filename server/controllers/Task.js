const models = require('../models');

const Task = models.Task;

const makerPage = (req, res) => {
    Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        return res.render('app', { csrfToken: req.csrfToken(), tasks: docs });  
    });
};

const makeTask = (req, res) => {
    if (!req.body.duedate || !req.body.task){
        return res.status(400).json({ error: 'Both date and task are required' });
    }
    
    const taskData = {
        duedate: req.body.duedate,
        task: req.body.task,
        owner: req.session.account._id,
    };
    
    const newTask = new Task.TaskModel(taskData);
    
    const taskPromise = newTask.save();
    
    taskPromise.then(() => res.json({ redirect: '/maker' }));
    
    taskPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Taks already exists.' });
        }
        
        return res.status(400).json({ error: 'An error occurred' });
    });
    
    return taskPromise;
};

const getTasks = (request, response) => {
    const req = request; 
    const res = response;
    
    return Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
        if(err) {
            console.log(err);
            return res.status(400).json({ error: "An error occurred" });
        }
        
        return res.json({ task: docs });
    });
};

module.exports.makerPage = makerPage;
module.exports.getTasks = getTasks;
module.exports.make = makeTask;