const sampleTasks = require('../data/tasks').sampleTasks;
const validateTask = require('../utils/taskVerifier').verifyTask;
const validatePatchObject = require('../utils/taskVerifier').verifyPatchObject;
const taskUtils = require('../utils/taskUtils')

exports.getTaskById = (req, res, next) => {
    const taskId = parseInt(req.params.id); //string => int for comparison
    const task = taskUtils.findTask(taskId);
    if (!task) taskUtils.taskNotFound(taskId);
    res.send(task);
};

exports.createNewTask = (req, res, next) => {
    const {error} = validateTask(req.body); // Validate formatting of new task
    if (error) return res.status(400).send(error.message);

    const task = {
        id: sampleTasks.length + 1,
        name: req.body.name,
        completed: req.body.completed
    };
    sampleTasks.push(task);
    res.status(201).send(task);
};

exports.replaceTaskById = (req, res, next) => {
    const task = taskUtils.findTask(parseInt(req.params.id));
    if (!task) taskUtils.taskNotFound(taskId);
    const {error} = validateTask(req.body);
    if (error) return res.status(400).send(error.message);

    task.name = req.body.name;
    task.completed = req.body.completed;

    res.send(task);
};

// Accepts custom user objects
exports.modifyTaskById = (req, res, next) => {
    const task = taskUtils.findTask(parseInt(req.params.id));
    if (!task) taskUtils.taskNotFound(taskId);
    const {error} = validatePatchObject(req.body);
    if (error) return res.status(400).send(error.message);

    if(req.body.name) task.name = req.body.name;
    if(req.body.completed) task.completed = req.body.completed;

    res.send(task);
};

exports.deleteTask = (req, res, next) => {
    const task = taskUtils.findTask(parseInt(req.params.id));
    if (!task) taskUtils.taskNotFound(taskId);

    // Delete task with sent id
    newTasks = sampleTasks.filter((task) => {
        return task.id !== parseInt(req.params.id);
    });

    res.send(newTasks);
};