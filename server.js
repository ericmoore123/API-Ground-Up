const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Controller
const controller = require('./controller/api_controller');

const PORT = process.env.PORT || 8800;
app.use(express.json());
app.set('view engine', 'ejs');

// ========== API Routes ========== 
app.get('/api/tasks', controller.getTasks);

app.get('/api/tasks/:id', controller.getTaskById);
app.post('/api/tasks', controller.createNewTask);
app.put('/api/tasks/:id', controller.replaceTaskById);

// Accepts custom objects
app.patch('/api/tasks/:id', controller.modifyTaskById);
app.delete('/api/tasks/:id', controller.deleteTask);

app.listen(PORT, () => {
    // connect_Db();
    console.log('Server running on port: ', PORT);
});