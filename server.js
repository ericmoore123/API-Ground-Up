const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const sampleTasks = require('./data/tasks').sampleTasks;

// Controller
const controller = require('./controller/api_controller');

const PORT = process.env.PORT || 8800;
app.use(express.json());

// ========== API Routes ========== 
app.get('/api/tasks', (req, res, next) => {
    res.send(sampleTasks);
});

app.get('/api/tasks/:id', controller.getTaskById);
app.post('/api/tasks', controller.createNewTask);
app.put('/api/tasks/:id', controller.replaceTaskById);

// Accepts custom objects
app.patch('/api/tasks/:id', controller.modifyTaskById);
app.delete('/api/tasks/:id', controller.deleteTask);

const { connect_Db } = require('./db/db_postgres');
app.listen(PORT, () => {
    // connect_Db();
    console.log('Server running on port: ', PORT);
});