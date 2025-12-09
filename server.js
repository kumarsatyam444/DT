const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Task Management API',
        endpoints: {
            getAllTasks: 'GET /api/tasks',
            getTask: 'GET /api/tasks/:id',
            createTask: 'POST /api/tasks',
            updateTask: 'PUT /api/tasks/:id',
            deleteTask: 'DELETE /api/tasks/:id'
        }
    });
});

// In-memory database
let tasks = [];


app.get('/api/tasks', (req, res) => {
    const { status, priority } = req.query;
    let filteredTasks = [...tasks];

    if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    if (priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    res.json({
        success: true,
        count: filteredTasks.length,
        data: filteredTasks
    });
});


app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);

    if (!task) {
        return res.status(404).json({
            success: false,
            error: 'Task not found'
        });
    }

    res.json({ success: true, data: task });
});


app.post('/api/tasks', (req, res) => {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            error: 'Title is required'
        });
    }

    const newTask = {
        id: uuidv4(),
        title,
        description: description || '',
        priority: priority || 'medium',
        status: 'pending',
        dueDate: dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);

    res.status(201).json({
        success: true,
        data: newTask
    });
});


app.put('/api/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Task not found'
        });
    }

    const { title, description, priority, status, dueDate } = req.body;

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title || tasks[taskIndex].title,
        description: description ?? tasks[taskIndex].description,
        priority: priority || tasks[taskIndex].priority,
        status: status || tasks[taskIndex].status,
        dueDate: dueDate ?? tasks[taskIndex].dueDate,
        updatedAt: new Date().toISOString()
    };

    res.json({ success: true, data: tasks[taskIndex] });
});


app.delete('/api/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Task not found'
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.json({
        success: true,
        message: 'Task deleted successfully',
        data: deletedTask
    });
});


app.listen(PORT, () => {
    console.log(`Task Management API running on http://localhost:${PORT}`);
});
