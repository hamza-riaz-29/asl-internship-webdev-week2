console.log("To-Do application successfully initialized!");
// Import mandatory data persistence architecture from storage module
import { saveTasks, loadTasks } from './storage.js';

// DOM Element References
const taskInputEl = document.querySelector('#task-input');
const addBtnEl = document.querySelector('#add-btn');
const errorMessageEl = document.querySelector('#error-message');
const counterEl = document.querySelector('#counter');
const taskListEl = document.querySelector('#task-list');

const filterAllEl = document.querySelector('#filter-all');
const filterActiveEl = document.querySelector('#filter-active');
const filterCompletedEl = document.querySelector('#filter-completed');

// Application State Parameters
let tasks = loadTasks();
let currentFilter = 'all'; 

/**
 * Handles the view mutation and dynamic DOM updates based on active filters.
 */
function renderApp() {
    taskListEl.innerHTML = ''; // Clear existing DOM element nodes
    
    // Process structural filters on current tasks array state
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    // Handle empty state layout updates
    if (filteredTasks.length === 0) {
        taskListEl.innerHTML = `<li class="empty-message">No tasks found in this view.</li>`;
    } else {
        // Dynamically append task template wrappers to list elements
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="status-checkbox">
                <span class="task-text">${task.text}</span>
                <button class="delete-btn">Delete</button>
            `;

            // Event bindings for task completion toggle
            li.querySelector('.status-checkbox').addEventListener('change', () => toggleTask(task.id));
            li.querySelector('.task-text').addEventListener('click', () => toggleTask(task.id));
            
            // Event binding for task deletion configuration
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

            taskListEl.appendChild(li);
        });
    }

    // Dynamic processing of incomplete task indicators
    const remainingCount = tasks.filter(t => !t.completed).length;
    counterEl.textContent = `Remaining Tasks: ${remainingCount}`;
}

/**
 * Handles the functional execution data flow for creating new tasks.
 */
function handleAddTask() {
    const textVal = taskInputEl.value.trim(); // Sanitize trailing/leading whitespace elements
    
    // Inline data input validation rules validation
    if (textVal === '') {
        errorMessageEl.textContent = "Task content cannot be blank or empty!";
        errorMessageEl.classList.remove('hidden');
        return;
    }

    errorMessageEl.classList.add('hidden'); // Reset input warning containers

    const newTask = {
        id: Date.now(),
        text: textVal,
        completed: false
    };

    tasks.push(newTask);
    saveTasks(tasks);
    taskInputEl.value = ''; // Clean input workspace
    renderApp();
}

/**
 * Alternates the boolean execution parameter of the completed task object status.
 */
function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks(tasks);
    renderApp();
}

/**
 * Removes target entity object matches from active memory and updates localStorage.
 */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
    renderApp();
}

/**
 * Manages active CSS visibility classes on structural navigation filter configurations.
 */
function updateFilterActiveState(activeButton) {
    [filterAllEl, filterActiveEl, filterCompletedEl].forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
}

// Global Event Trigger Configurations
addBtnEl.addEventListener('click', handleAddTask);

// Setup structural input field mapping for keyboard interactions
taskInputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTask();
});

// Structural Filter Trigger Hooks
filterAllEl.addEventListener('click', () => {
    currentFilter = 'all';
    updateFilterActiveState(filterAllEl);
    renderApp();
});

filterActiveEl.addEventListener('click', () => {
    currentFilter = 'active';
    updateFilterActiveState(filterActiveEl);
    renderApp();
});

filterCompletedEl.addEventListener('click', () => {
    currentFilter = 'completed';
    updateFilterActiveState(filterCompletedEl);
    renderApp();
});

// Initialize core setup routines on application load
renderApp();