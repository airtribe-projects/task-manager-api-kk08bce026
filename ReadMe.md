# Task Manager API

A simple RESTful API for managing tasks, built with Node.js and Express. Tasks are stored in a local JSON file. The API supports creating, reading, updating, deleting, filtering, and sorting tasks, as well as assigning priorities.

## Overview

This project provides endpoints to:
- Create, update, delete, and retrieve tasks
- Filter tasks by completion status
- Sort tasks by creation date
- Assign and filter by priority (`low`, `medium`, `high`)

## Setup Instructions

1. **Clone the repository**  
   ```
   git clone <your-repo-url>
   cd task-manager-api-kk08bce026
   ```

2. **Install dependencies**  
   ```
   npm install
   ```

3. **Start the server**  
   ```
   node app.js
   ```
   The server will run on [http://localhost:3000](http://localhost:3000).

## API Endpoints

### Create a Task

- **POST** `/tasks`
- **Body (JSON):**
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "priority": "medium"
  }
  ```
- **Response:** `201 Created` with the created task object.

---

### Get All Tasks

- **GET** `/tasks`
- **Query Parameters:**
  - `completed` (optional): `true` or `false`
  - `sort` (optional): `createdAt`
- **Example:** `/tasks?completed=true&sort=createdAt`
- **Response:** Array of task objects.

---

### Get Task by ID

- **GET** `/tasks/:id`
- **Response:** Task object if found, `404` if not.

---

### Update a Task

- **PUT** `/tasks/:id`
- **Body (JSON):**
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "completed": true,
    "priority": "high"
  }
  ```
- **Response:** Updated task object, or `404` if not found.

---

### Delete a Task

- **DELETE** `/tasks/:id`
- **Response:** `204 No Content` if deleted, `404` if not found.

---

### Get Tasks by Priority

- **GET** `/tasks/priority/:level`
- **:level:** `low`, `medium`, or `high`
- **Response:** Array of tasks with the specified priority.

---

## Testing the API

You can use [Postman](https://www.postman.com/) or `curl` to test the endpoints.

**Example: Create a Task**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Try API","completed":false,"priority":"low"}'
```

**Example: Get All Tasks**
```bash
curl http://localhost:3000/tasks
```

**Example: Get Tasks by Priority**
```bash
curl http://localhost:3000/tasks/priority/high
```  

---

## Notes

- All data is stored in `task.json` in the project directory.
- The API validates input and returns appropriate error messages for invalid requests.

----------------------------------------------------------------------------------------------
# Task Manager & Personalized News API

A secure RESTful backend built with Node.js and Express that allows users to manage tasks and consume personalized news based on preferences. Users can register, log in, update preferences, fetch news from NewsAPI, track read/favorite articles, and manage tasks with filtering and sorting.

---
## Features

- Secure registration & login with hashed passwords
- JWT-protected routes
- Personalized news feeds via NewsAPI
- News caching for faster response
- Article tracking (read/favorite)
- Keyword-based search
- Task CRUD with filtering, priority & sorting
- Input validation & robust error handling
- Role-based access for admin endpoints

## Technologies

- Node.js
- Express
- Axios
- bcrypt
- JSON Web Tokens (JWT)
- dotenv
- NewsAPI

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task-manager-api-kk08bce026
   ```

2. **Install dependencies**
   ```bash
   npm install express axios bcrypt jsonwebtoken dotenv
   ```

3. **Configure environment**
   - Create a `.env` file in the root:
     ```
     JWT_SECRET=your_jwt_secret
     NEWS_API_KEY=your_newsapi_key
     ```

4. **Start the server**
   ```bash
   node app.js
   ```
   The server runs at [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

### User Registration & Login

- **POST /register**
  - Body:
    ```json
    { "username": "user@example.com", "password": "yourpassword" }
    ```
  - Password must be at least 6 characters. Username must be a valid email.
  - Response: `201 Created` or error.

- **POST /login**
  - Body:
    ```json
    { "username": "user@example.com", "password": "yourpassword" }
    ```
  - Response: `{ "token": "<JWT token>" }`

---

### Authentication

- All protected endpoints require the JWT token in the `Authorization` header:
  ```
  Authorization: Bearer <your_token>
  ```

---

### User Preferences

- **GET /preferences**  
  Retrieve logged-in user's preferences.
  - Requires JWT token.
  - Response: `{ "preferences": { categories: [...], languages: [...] } }`

- **PUT /preferences**  
  Update preferences.
  - Body:
    ```json
    { "categories": ["tech", "sports"], "languages": ["en", "hi"] }
    ```
  - Requires JWT token.
  - Response: `{ "message": "Preferences updated", "preferences": {...} }`

---

### Task Management

- **POST /tasks**
  - Body:
    ```json
    {
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "priority": "medium"
    }
    ```
  - Validation: All fields required, priority must be `low`, `medium`, or `high`.
  - Response: `201 Created` with task object.

- **GET /tasks**
  - Query params: `completed=true|false`, `sort=createdAt`
  - Response: Array of tasks.

- **GET /tasks/:id**
  - Response: Task object or `404`.

- **PUT /tasks/:id**
  - Body: Same as POST /tasks.
  - Response: Updated task or `404`.

- **DELETE /tasks/:id**
  - Response: `204 No Content` or `404`.

- **GET /tasks/priority/:level**
  - :level: `low`, `medium`, `high`
  - Response: Array of tasks.

---

### News Integration

- **GET /news**
  - Fetches news articles based on user preferences (categories, languages).
  - Requires JWT token.
  - Uses NewsAPI and caches results per user for 10 minutes.
  - Response: `{ "articles": [...] }`

- **POST /news/read/:url**
  - Mark an article as read for the logged-in user.
  - Requires JWT token.

- **POST /news/favorite/:url**
  - Mark an article as favorite for the logged-in user.
  - Requires JWT token.

- **GET /news/search/:keyword**
  - Search news articles by keyword.
  - Requires JWT token.

---

## Data Storage

- **Tasks:** Stored in `task.json`
- **Users:** Stored in `users.json` (with hashed passwords, preferences, read/favorite articles)
- **News Cache:** In-memory per user for faster repeated requests

---

## Validation & Error Handling

- All endpoints validate input and return appropriate error messages (`400`, `401`, `403`, `404`, `409`, `500`).
- JWT authentication required for protected routes.
- News API errors handled with `502` or `500`.

---

## Example Usage (with curl)

**Register:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"yourpassword"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"yourpassword"}'
```

**Get News (with JWT):**
```bash
curl http://localhost:3000/news \
  -H "Authorization: Bearer <your_token>"
```

**Update Preferences:**
```bash
curl -X PUT http://localhost:3000/preferences \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"categories":["tech"],"languages":["en"]}'
```

---

## Notes

- Make sure to use your own NewsAPI key in `.env`.
- All sensitive actions require JWT authentication.
- Data is persisted in local JSON files.
- For admin-only endpoints, set `"role": "admin"` in `users.json`.

---

✅ Project Completion Summary
| Step | Description | Status | 
| 1️⃣ | Project setup and dependency installation | ✔️ | 
| 2️⃣ | Secure user registration and login | ✔️ | 
| 3️⃣ | JWT authentication and preferences | ✔️ | 
| 4️⃣ | NewsAPI integration and caching | ✔️ | 
| 5️⃣ | Validation and error handling | ✔️ | 
| 6️⃣ | Optional extensions (search, read/favorite tracking, periodic refresh) | ✔️ | 
| 7️⃣ | Finalized README and manual testing | ✔️ | 


All functionality tested using Postman and curl.
Code is ready for submission via PR to the feedback branch.



