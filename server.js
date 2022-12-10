const express = require('express');
const app = express();
const validateTask = require('./utils/taskVerifier').verifyTask;
const validatePatchObject = require('./utils/taskVerifier').verifyPatchObject;
const sampleTasks = require('./data/tasks').sampleTasks;
const PORT = process.env.PORT || 8800;

app.use(express.json());

// ========== Utility functions ==========
const findTask = (taskId) => {
    return sampleTasks.find(task => task.id === taskId);
};
const taskNotFound = (taskId) => {
    return res.status(404).send(`Task with id: ${taskId} not found.`);
};


// ========== API Routes ========== 
app.get('/api/tasks', (req, res, next) => {
    res.send(sampleTasks);
});

app.get('/api/tasks/:id', (req, res, next) => {
    const taskId = parseInt(req.params.id); //string => int for comparison
    const task = findTask(taskId);
    if (!task) taskNotFound(taskId);
    res.send(task);
});

app.post('/api/tasks', (req, res, next) => {
    const {error} = validateTask(req.body); // Validate formatting of new task
    if (error) return res.status(400).send(error.message);

    const task = {
        id: sampleTasks.length + 1,
        name: req.body.name,
        completed: req.body.completed
    };
    sampleTasks.push(task);
    res.status(201).send(task);
});

app.put('/api/task/:id', (req, res, next) => {
    const task = findTask(parseInt(req.params.id));
    if (!task) taskNotFound(taskId);
    const {error} = validateTask(req.body);
    if (error) return res.status(400).send(error.message);

    task.name = req.body.name;
    task.completed = req.body.completed;

    res.send(task);
});

// Accepts custom objects
app.patch('/api/task/:id', (req, res, next) => {
    const task = findTask(parseInt(req.params.id));
    if (!task) taskNotFound(taskId);
    const {error} = validatePatchObject(req.body);
    if (error) return res.status(400).send(error.message);

    if(req.body.name) task.name = req.body.name;
    if(req.body.completed) task.completed = req.body.completed;

    res.send(task);
});

app.delete('/api/tasks/:id', (req, res, next) => {
    const task = findTask(parseInt(req.params.id));
    if (!task) taskNotFound(taskId);

    // Delete task with sent id
    newTasks = sampleTasks.filter((task) => {
        return task.id !== parseInt(req.params.id);
    });

    res.send(newTasks);
});

app.listen(PORT, () => {
    console.log('Server running on port: ', PORT);
});