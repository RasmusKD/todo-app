const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Midlertidig lagring af opgaver
let tasks = [];

// Hent alle opgaver
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Tilføj ny opgave
app.post('/tasks', (req, res) => {
    const task = req.body.task;
    tasks.push(task);
    res.status(201).json({ message: 'Task added', tasks });
});

// Slet en opgave
app.delete('/tasks/:index', (req, res) => {
    const index = req.params.index;
    if (tasks[index]) {
        tasks.splice(index, 1);
        res.json({ message: 'Task deleted', tasks });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Opdater en eksisterende opgave
app.put('/tasks/:index', (req, res) => {
    const index = req.params.index;
    const updatedTask = req.body.task;
    if (tasks[index]) {
        tasks[index] = updatedTask;
        res.json({ message: 'Task updated', tasks });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});


// Start serveren
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
