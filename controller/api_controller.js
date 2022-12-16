const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'});

const { Pool } = require('pg');
const pool = new Pool(); // Use pool when multiple transactions are needed

// Custom Imports
const validateTask = require('../utils/taskVerifier').verifyTask;
const validatePatchObject = require('../utils/taskVerifier').verifyPatchObject;

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

exports.getHome = async (req, res, next) => {
    const client = await pool.connect();
    try{
        const tasks = await client.query('SELECT * FROM tasks');
        res.status(200).render('pages/index', {
            tasks: tasks.rows
        });
    }catch(err){console.error(err)};
};

exports.getTasks = async (req, res, next) => {
    const client = await pool.connect();
    try{
        const tasks = await client.query('SELECT * FROM tasks');
        res.status(200).send(tasks.rows);
    }catch(err){
        console.error(err)
    }finally {
        client.end();
    };
};

exports.getTaskById = async (req, res, next) => {
    const taskId = parseInt(req.params.id); //string => int for comparison
    const client = await pool.connect();
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

        res.status(200).send(`New DB entry with id: ${new_Id} created successfully!`);
    }catch(err){
        console.error(err);
    }finally {
        client.end();
    };
};

// Only accepts validated task objects
exports.replaceTaskById = async (req, res, next) => {
    const taskId = parseInt(req.params.id); 
    const client = await pool.connect();
    try{
        const searchTask = await taskLookup_db(taskId);
        if(await searchTask == false ) {
            res.status(404).send(`Task with id: ${taskId} not found.`);
        }else{
            const { error } = validateTask(req.body);
            if (error) return res.status(400).send(error.message);

            const queryText = `UPDATE "tasks" SET "name" = $1, "completed" = $2 WHERE "id" = $3`;
            const queryVals = [req.body.name, req.body.completed, taskId];
            const query = await client.query(queryText, queryVals);

            // If query returns "No rows effected" send error
            if(await query.rowCount === 0) return res.status(400).send(`No database entries effected!`);

            res.status(200).send(`Task with id: ${taskId} replaced successfully!`);
        };
    }catch(err){
        console.error(err);
    }finally{
        client.end();
    };
};

// Accepts custom user objects
exports.modifyTaskById = async (req, res, next) => {
    const taskId = parseInt(req.params.id); 
    const client = await pool.connect();
    try{
        const searchTask = await taskLookup_db(taskId);
        if(await searchTask == false ) {
            res.status(404).send(`Task with id: ${taskId} not found.`);
        }else{
            const { error } = validatePatchObject(req.body);
            if (error) return res.status(400).send(error.message);

            // Loop over body params to update task data
            for(let [key, val] of Object.entries(req.body)){
                const queryText = `UPDATE "tasks" SET "${key}" = $1 WHERE "id" = $2`;
                const queryVals = [val, taskId];  
                const query = await client.query(queryText, queryVals);
                if(await query.rowCount === 0) return res.status(400).send(`No database entries effected!`);
            };
            res.status(200).send(`Field(s) in task with id: ${taskId} updated successfully!`);
        };
    }catch(err){
        console.error(err);
    }finally{
        client.end();
    };
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
            // console.log(del);
            res.send(`${del.rowCount} DB record(s) with id ${taskId} deleted successfully!`);
        };
    }catch(err){
        console.error(err);
    }finally {
        client.end();
    };
};