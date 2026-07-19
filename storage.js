// Configuration constant for localStorage key identification
const STORAGE_KEY = 'asl_todo_tasks';

/**
 * Persists the current state of tasks array to browser localStorage.
 * Serializes the object array into a JSON string format.
 */
export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Retrieves and deserializes the task array from browser localStorage.
 * Returns an empty array fallback if no records exist.
 */
export function loadTasks() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}