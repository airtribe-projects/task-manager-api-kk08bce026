
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< Updated upstream
=======

const fs = require('fs');
const path = require('path');
let newsCache = {}; // Stores cached news per userId

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


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const USERS_PATH = path.join(__dirname, 'users.json');
//Load users from file
let users = [];
try {
    if (fs.existsSync(USERS_PATH)) {
        const userData = fs.readFileSync(USERS_PATH, 'utf-8');
        users = JSON.parse(userData).users || [];
    }
}
catch (err) {
    console.error('Failed to load users.json:', err.message);
}

// Save users to file
function saveUsersToFile() {
    fs.writeFileSync(USERS_PATH, JSON.stringify({ users }, null, 2));
}


// POST /register: User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Validate presence and format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (typeof username !== 'string' || !emailRegex.test(username)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ error: 'Username already exists.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: users.length + 1, username, password: hashedPassword };
        users.push(newUser);
        saveUsersToFile();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /login: User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// --- Authentication Middleware ---
// Middleware to authenticate JWT tokens
// This middleware checks for the presence of a valid JWT token in the Authorization header
// If the token is valid, it adds the user information to the request object
// If the token is missing or invalid, it responds with an error
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ error: 'Token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

// --- User Preferences Endpoints ---

// GET /preferences: Retrieve logged-in user's preferences
// This endpoint is protected and requires authentication
// Example response: { preferences: { categories: ["tech", "sports"], languages: ["en", "hi"] } }
app.get('/preferences', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ preferences: user.preferences || {} });
});

// PUT /preferences: Update logged-in user's preferences
// Example body: { categories: ["tech", "sports"], languages: ["en", "hi"] }
app.put('/preferences', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Example: { categories: ["tech", "sports"], languages: ["en", "hi"] }
    const { categories, languages } = req.body;
    user.preferences = {
        categories: Array.isArray(categories) ? categories : [],
        languages: Array.isArray(languages) ? languages : []
    };
    saveUsersToFile();
    res.json({ message: 'Preferences updated', preferences: user.preferences });
});

// --- User Management Endpoints ---
// GET /users: Retrieve all users (admin only)
// This endpoint is protected and should only be accessible by an admin user
app.get('/users', authenticateToken, (req, res) => {
    const requestingUser = users.find(u => u.id === req.user.id);

    // Optional: restrict access to specific admin user
    if (requestingUser.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    // You can filter sensitive fields before sending
    const filteredUsers = users.map(u => ({
        id: u.id,
        username: u.username,
        preferences: u.preferences,
        read: u.read,
        favorites: u.favorites
    }));

    res.json({ users: filteredUsers });
});

// GET /me: Retrieve logged-in user's profile
app.get('/me', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { id, username, preferences, read, favorites } = user;
    res.json({ id, username, preferences, read, favorites });
});


const axios = require('axios');
// GET /news: Retrieve news articles based on user preferences
// Uses NewsAPI to fetch articles based on user preferences
app.get('/news', authenticateToken, async (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { categories = [], languages = [] } = user.preferences || {};
    const query = categories.length > 0 ? categories.join(' OR ') : 'general';
    const language = languages.length > 0 ? languages[0] : 'en';

    const now = Date.now();
    const cached = newsCache[user.id];

    if (cached && now - cached.timestamp < 1000 * 60 * 10) {
        return res.json({ articles: cached.articles });
    }

    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: query,
                language,
                sortBy: 'publishedAt',
                pageSize: 5,
                apiKey: NEWS_API_KEY
            }
        });

        if (!response.data.articles) {
            return res.status(502).json({ error: 'Failed to fetch articles from NewsAPI' });
        }

        const articles = response.data.articles;
        newsCache[user.id] = { articles, timestamp: now };

        res.json({ articles });
    } catch (err) {
        console.error('News fetching error:', err.message);
        res.status(500).json({ error: 'Internal server error while fetching news' });
    }
});

// MARK AS READ
// POST /news/read/:url: Mark an article as read
app.post('/news/read/:url', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    const articleUrl = decodeURIComponent(req.params.url);

    if (!user.read.includes(articleUrl)) {
        user.read.push(articleUrl);
        saveUsersToFile();
    }
    res.json({ message: 'Article marked as read.', url: articleUrl });
});

// MARK AS FAVORITE
// POST /news/favorite/:url: Mark an article as favorite for the logged-in user
app.post('/news/favorite/:url', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    const articleUrl = decodeURIComponent(req.params.url);

    if (!user.favorites.includes(articleUrl)) {
        user.favorites.push(articleUrl);
        saveUsersToFile();
    }
    res.json({ message: 'Article marked as favorite.', url: articleUrl });
});

// GET /news/favorites: Retrieve favorite articles of the logged-in user
app.get('/news/search/:keyword', authenticateToken, async (req, res) => {
    const keyword = req.params.keyword;

    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: keyword,
                sortBy: 'relevancy',
                pageSize: 5,
                apiKey: NEWS_API_KEY
            }
        });

        res.json({ articles: response.data.articles || [] });
    } catch (err) {
        console.error('News search error:', err.message);
        res.status(500).json({ error: 'Failed to search news.' });
    }
});

// --- Catch-all for unknown routes ---
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found.' });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
});


// Periodic news update for all users
setInterval(async () => {
    for (const user of users) {
        const { categories = [], languages = [] } = user.preferences || {};
        const query = categories.length > 0 ? categories.join(' OR ') : 'general';
        const language = languages.length > 0 ? languages[0] : 'en';

        try {
            const response = await axios.get('https://newsapi.org/v2/everything', {
                params: { q: query, language, sortBy: 'publishedAt', pageSize: 5, apiKey: NEWS_API_KEY }
            });

            newsCache[user.id] = {
                articles: response.data.articles || [],
                timestamp: Date.now()
            };
        } catch (err) {
            console.error(`Periodic update failed for ${user.username}:`, err.message);
        }
    }
}, 1000 * 60 * 10); // Every 10 minutes

>>>>>>> Stashed changes
app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;