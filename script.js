let tasks = [];
let editingIndex = -1;

// Add or update a task
function addTask() {
  const taskName = document.getElementById("task-name").value.trim();
  const taskDescription = document.getElementById("task-description").value.trim();
  const taskPriority = document.getElementById("priority").value;
  const taskDueDate = document.getElementById("due-date").value;
  const taskTags = document.getElementById("tags").value.trim();

  if (!taskName) {
    alert("Task name cannot be empty!");
    return;
  }

  const newTask = {
    name: taskName,
    description: taskDescription,
    priority: taskPriority,
    dueDate: taskDueDate,
    tags: taskTags ? taskTags.split(",").map(tag => tag.trim()) : [],
    completed: false,
  };

  if (editingIndex === -1) {
    tasks.push(newTask); // Add new task
  } else {
    tasks[editingIndex] = newTask; // Update existing task
    editingIndex = -1; // Reset editing index
  }

  displayTasks();
  clearTaskForm();
}

// Display tasks based on filter
function displayTasks(filter = "all") {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === "today") {
    filteredTasks = tasks.filter(task => isDueToday(task.dueDate));
  } else if (filter === "tomorrow") {
    filteredTasks = tasks.filter(task => isDueTomorrow(task.dueDate));
  } else if (filter === "week") {
    filteredTasks = tasks.filter(task => isDueThisWeek(task.dueDate));
  } else if (filter === "priority") {
    filteredTasks = [...tasks].sort((a, b) => {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.innerHTML = `
      <div class="task-details">
        <h3>${task.name}</h3>
        <p>${task.description}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Due Date:</strong> ${task.dueDate || "No due date"}</p>
        <p><strong>Tags:</strong> ${task.tags.join(", ") || "No tags"}</p>
      </div>
      <div class="task-actions">
        <button onclick="markTaskComplete(${index})">Complete</button>
        <button onclick="editTask(${index})">Edit</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Mark task as completed and remove from the list
function markTaskComplete(index) {
  tasks.splice(index, 1); // Remove the task from the array
  displayTasks(); // Refresh the list
}

// Edit a task
function editTask(index) {
  const task = tasks[index];
  document.getElementById("task-name").value = task.name;
  document.getElementById("task-description").value = task.description;
  document.getElementById("priority").value = task.priority;
  document.getElementById("due-date").value = task.dueDate;
  document.getElementById("tags").value = task.tags.join(", ");
  editingIndex = index;
}

// Clear the task form
function clearTaskForm() {
  document.getElementById("task-name").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("priority").value = "low";
  document.getElementById("due-date").value = "";
  document.getElementById("tags").value = "";
}

// Search tasks
function searchTasks() {
  const query = document.getElementById("search-bar").value.toLowerCase();
  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(query) ||
    task.description.toLowerCase().includes(query)
  );
  displayFilteredTasks(filteredTasks);
}

// Display filtered tasks
function displayFilteredTasks(filteredTasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.innerHTML = `
      <div class="task-details">
        <h3>${task.name}</h3>
        <p>${task.description}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Due Date:</strong> ${task.dueDate || "No due date"}</p>
        <p><strong>Tags:</strong> ${task.tags.join(", ") || "No tags"}</p>
      </div>
      <div class="task-actions">
        <button onclick="markTaskComplete(${index})">Complete</button>
        <button onclick="editTask(${index})">Edit</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Helper functions for date-based filters
function isDueToday(dueDate) {
  const today = new Date();
  const taskDate = new Date(dueDate);
  return taskDate.toDateString() === today.toDateString();
}

function isDueTomorrow(dueDate) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const taskDate = new Date(dueDate);
  return taskDate.toDateString() === tomorrow.toDateString();
}

function isDueThisWeek(dueDate) {
  const today = new Date();
  const taskDate = new Date(dueDate);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);
  return taskDate >= today && taskDate <= weekEnd;
}

// Filter tasks by tags
function filterByTag(tag) {
  const filteredTasks = tasks.filter(task => task.tags.includes(tag));
  displayFilteredTasks(filteredTasks);
}

// Handle sidebar filter calls
function filterTasks(filter) {
  displayTasks(filter);
}
