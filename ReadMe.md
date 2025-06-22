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