const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'});

const { Pool } = require('pg');
const pool = new Pool(); // Use pool when multiple transactions are needed

// Custom Imports
const validateTask = require('../utils/taskVerifier').verifyTask;
const validatePatchObject = require('../utils/taskVerifier').verifyPatchObject;
const taskUtils = require('../utils/taskUtils')

const taskLookup_db = async (id) => {
    const client = await pool.connect();
    try {
        const query = await client.query(`SELECT * FROM tasks WHERE id = ${id}`);
        if (query.rows.length === 0){
            return false;
        }else{
            return query;
        };
    }catch(err){
        return console.error(err);
    }finally {
        client.end();
    };
};

exports.getTasks = async (req, res, next) => {
    const client = await pool.connect();
    try{
        const tasks = await client.query('SELECT * FROM tasks');
        // res.send(JSON.stringify(tasks.rows));
        res.render('pages/index', {
            tasks: tasks.rows
        });
    }catch(err){
        console.error(err)
    }finally {
        client.end();
    };
};

exports.getTaskById = async (req, res, next) => {
    const taskId = parseInt(req.params.id); //string => int for comparison

    try{
        const searchTask = await taskLookup_db(taskId);
        if(await searchTask == false ) {
            res.status(404).send(`Task with id: ${taskId} not found.`);
        }else{
            res.send(JSON.stringify(searchTask.rows));
        }
    }catch(err) {
        console.error(err);
    }finally {
        client.end();
    };
};

exports.createNewTask = async (req, res, next) => {
    const { error } = validateTask(req.body); // Validate formatting of new task
    if (error) return res.status(400).send(error.message);

    const client = await pool.connect();
    try{
        const lastElQuery = await client.query('SELECT * FROM tasks ORDER BY id DESC LIMIT 1');
        const new_Id = lastElQuery.rows[0].id + 1;
        
        const queryText = "INSERT INTO tasks (id, name, completed) VALUES ($1, $2, $3)";
        const queryVals = [new_Id, req.body.name, req.body.completed];
        await client.query(queryText, queryVals);

        res.status(201).send(`New DB entry with id: ${new_Id} created successfully!`);
    }catch(err){
        console.error(err);
    }finally {
        client.end();
    };
};

exports.replaceTaskById = (req, res, next) => {
    const task = taskUtils.findTask(parseInt(req.params.id));
    if (!task) taskUtils.taskNotFound(taskId);
    const { error } = validateTask(req.body);
    if (error) return res.status(400).send(error.message);

    task.name = req.body.name;
    task.completed = req.body.completed;

    res.send(task);
};

// Accepts custom user objects
exports.modifyTaskById = (req, res, next) => {
    const task = taskUtils.findTask(parseInt(req.params.id));
    if (!task) taskUtils.taskNotFound(taskId);
    const { error } = validatePatchObject(req.body);
    if (error) return res.status(400).send(error.message);

    if (req.body.name) task.name = req.body.name;
    if (req.body.completed) task.completed = req.body.completed;

    res.send(task);
};

exports.deleteTask = async (req, res, next) => {
    const taskId = parseInt(req.params.id);

    const client = await pool.connect();
    try{
        const query = await taskLookup_db(taskId);
        if(await query == false){
            res.status(404).send(`Task with id: ${taskId} not found.`);
        }else{
            const del = await client.query(`DELETE FROM tasks WHERE id = ${taskId}`);
            res.send(`${del.rowCount} DB record(s) with id ${taskId} deleted successfully!`);
        };
    }catch(err){
        console.error(err);
    }finally {
        client.end();
    };
};