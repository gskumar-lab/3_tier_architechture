const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const cors = require('cors');

// Enable all CORS requests
app.use(cors());


app.use(express.json());  // To parse JSON data in the body

// Connect to MySQL RDS Database
const connection = mysql.createConnection({
    host: 'database-1.clquc0qum5rx.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: '9865968174',
    database: 'task_manager'
});

// Create Task
app.post('/tasks', (req, res) => {
    const { title, description, status, due_date } = req.body;
    const query = 'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)';
    connection.query(query, [title, description, status, due_date], (err, results) => {
        if (err) {
            res.status(500).send('Error inserting task');
        } else {
            res.status(201).json({ id: results.insertId, title, description, status, due_date });
        }
    });
});

// Get All Tasks
app.get('/tasks', (req, res) => {
    connection.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching tasks');
        } else {
            res.status(200).json(results);
        }
    });
});

// Update Task Status
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    connection.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id], (err, results) => {
        if (err) {
            res.status(500).send('Error updating task');
        } else {
            res.status(200).json({ id, status });
        }
    });
});

// Delete Task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send('Error deleting task');
        } else {
            res.status(200).send('Task deleted');
        }
    });
});

app.listen(port, () => {
    console.log(`Task Manager API running at http://localhost:${port}`);
});

