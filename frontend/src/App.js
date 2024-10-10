import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaSave } from 'react-icons/fa';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editedTask, setEditedTask] = useState('');

    // Hent opgaver fra backend
    useEffect(() => {
        fetch('/tasks')
            .then(response => response.json())
            .then(data => setTasks(data));
    }, []);

    // Tilføj ny opgave
    const addTask = () => {
        if (newTask.trim()) {  // Tjek for tomme opgaver
            fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: newTask.trim() }),
            })
                .then(response => response.json())
                .then(data => {
                    setTasks(data.tasks);
                    setNewTask(''); // Nulstil inputfeltet
                });
        }
    };


    // Slet opgave
    const deleteTask = (index) => {
        fetch(`/tasks/${index}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => setTasks(data.tasks));
    };

    // Start redigering
    const startEditing = (index) => {
        setEditIndex(index);
        setEditedTask(tasks[index]); // Sæt den nuværende opgavetekst til redigerbar
    };

    // Gem redigeret opgave
    const saveTask = (index) => {
        if (editedTask.trim()) {  // Tjek for tomme opgaver
            fetch(`/tasks/${index}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: editedTask.trim() }),
            })
                .then(response => response.json())
                .then(data => {
                    setTasks(data.tasks);
                    setEditIndex(null); // Afslut redigeringstilstand
                });
        }
    };


    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-900 text-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">To-Do List</h1>

            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="border border-gray-700 bg-gray-800 p-2 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    placeholder="Enter a task"
                />
                <button
                    onClick={addTask}
                    className="bg-blue-600 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Add Task
                </button>
            </div>

            <ul className="w-full max-w-md flex flex-col gap-4">
                {tasks.map((task, index) => (
                    <li
                        key={index}
                        className="bg-gray-800 p-4 flex justify-between items-center shadow rounded h-16 gap-4"
                    >
                        {editIndex === index ? (
                            // Hvis vi redigerer denne opgave, vis redigeringsinput
                            <input
                                type="text"
                                value={editedTask}
                                onChange={(e) => setEditedTask(e.target.value)}
                                className="border border-gray-700 bg-gray-700 p-2 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
                            />
                        ) : (
                            // Hvis vi ikke redigerer, vis opgaveteksten
                            <span>{task}</span>
                        )}

                        <div className="flex space-x-2">
                            {editIndex === index ? (
                                // Hvis vi er i redigeringsmode, vis gem-knap
                                <button
                                    onClick={() => saveTask(index)}
                                    className="text-green-400 hover:text-green-500 flex items-center"
                                >
                                    <FaSave />
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => startEditing(index)}
                                        className="text-blue-400 hover:text-blue-500"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => deleteTask(index)}
                                        className="text-red-400 hover:text-red-500"
                                    >
                                        <FaTimes />
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
