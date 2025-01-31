const apiUrl = 'http://15.207.223.6:3000/tasks';  // Replace with your EC2 public IP
// Replace with your EC2 public IP or domain

// Function to fetch all tasks and display them
function getTasks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('task-list').getElementsByTagName('tbody')[0];
            taskList.innerHTML = '';  // Clear the current list

            data.forEach(task => {
                const row = taskList.insertRow();
                row.innerHTML = `
                    <td>${task.title}</td>
                    <td>${task.description}</td>
                    <td class="${task.status === 'Completed' ? 'status-completed' : 'status-pending'}">${task.status}</td>
                    <td>${task.due_date}</td>
                    <td>
                        <button onclick="updateTask(${task.id}, '${task.status === 'Completed' ? 'Pending' : 'Completed'}')">Mark as ${task.status === 'Completed' ? 'Pending' : 'Completed'}</button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    </td>
                `;
            });
        });
}

// Function to create a new task
function createTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;

    const task = { title, description, status: 'Pending', due_date: dueDate };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    })
    .then(response => response.json())
    .then(() => {
        getTasks();  // Refresh task list after creating
        // Clear input fields
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-due-date').value = '';
    });
}

// Function to update task status (Completed or Pending)
function updateTask(taskId, newStatus) {
    fetch(`${apiUrl}/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
    })
    .then(() => getTasks());  // Refresh task list after updating
}

// Function to delete a task
function deleteTask(taskId) {
    fetch(`${apiUrl}/${taskId}`, { method: 'DELETE' })
        .then(() => getTasks());  // Refresh task list after deletion
}

// Initial fetch to display tasks when the page loads
window.onload = getTasks;

