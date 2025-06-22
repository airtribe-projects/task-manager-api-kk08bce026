const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'task.json');
function saveTasksToFile() {
  fs.writeFileSync(dataPath, JSON.stringify({ tasks }, null, 2));
}

//In-memory task storage
let tasks = [];
let nextId = 1;

// Load tasks from file
try {
  const fileData = fs.readFileSync(dataPath, 'utf-8');
  const parsed = JSON.parse(fileData);
  tasks = parsed.tasks || [];
  nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
} catch (err) {
  console.error('Failed to load tasks.json:', err.message);
}

// GET /tasks/:id: Retrieve a specific task by its ID
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});


// GET /tasks: Retrieve all tasks with optional filtering and sorting
app.get('/tasks', (req, res) => {
    let result = [...tasks];
    

    // Filtering by completion status
    if (typeof req.query.completed !== 'undefined') {
        if (req.query.completed === 'true' || req.query.completed === 'false') {
            const completedBool = req.query.completed === 'true';
            result = result.filter(t => t.completed === completedBool);
        } else {
            return res.status(400).json({ error: 'Invalid completed filter. Use true or false.' });
        }
    }

    // Sorting by creation date
    if (req.query.sort === 'createdAt') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    res.json(result);
});

// GET /tasks/priority/:level: Retrieve tasks by priority level
app.get('/tasks/priority/:level', (req, res) => {
    const validPriorities = ['low', 'medium', 'high'];
    const level = req.params.level;
    if (!validPriorities.includes(level)) {
        return res.status(400).json({ error: 'Invalid priority level. Use low, medium, or high.' });
    }
    const filtered = tasks.filter(t => t.priority === level);
    res.json(filtered);
});

// Add a priority attribute to tasks (low, medium, high)
// Update POST /tasks: Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed, priority } = req.body;
    const validPriorities = ['low', 'medium', 'high'];
    if (
        typeof title !== 'string' || title.trim() === '' ||
        typeof description !== 'string' || description.trim() === '' ||
        typeof completed !== 'boolean' ||
        typeof priority !== 'string' || !validPriorities.includes(priority)
    ) {
        return res.status(400).json({ error: 'Invalid task data. Title and description must be non-empty strings, completed must be a boolean, and priority must be one of: low, medium, high.' });
    }
    const newTask = {
        id: nextId++,
        title: title.trim(),
        description: description.trim(),
        completed,
        priority,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasksToFile();
    res.status(201).json(newTask);
});

// Update PUT /tasks/:id: Update an existing task by its ID
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    const validPriorities = ['low', 'medium', 'high'];
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const { title, description, completed, priority } = req.body;
    if (
        typeof title !== 'string' || title.trim() === '' ||
        typeof description !== 'string' || description.trim() === '' ||
        typeof completed !== 'boolean' ||
        typeof priority !== 'string' || !validPriorities.includes(priority)
    ) {
        return res.status(400).json({ error: 'Invalid task data. Title and description must be non-empty strings, completed must be a boolean, and priority must be one of: low, medium, high.' });
    }
    task.title = title.trim();
    task.description = description.trim();
    task.completed = completed;
    task.priority = priority;
    saveTasksToFile();
    res.json(task);
});

// DELETE /tasks/:id: Delete a task by its ID
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks.splice(index, 1);
    saveTasksToFile();
    res.status(204).send();
});


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;