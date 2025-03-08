// Task management module

class Task {
    constructor(title, description = '') {
        this.title = title;
        this.description = description;
        this.completed = false;
        this.createdAt = new Date();
    }

    toggleComplete() {
        this.completed = !this.completed;
        return this.completed;
    }

    getStatus() {
        return this.completed ? 'Completed' : 'Pending';
    }
}

// Utility functions
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Example usage
const createTask = (title, description) => {
    const task = new Task(title, description);
    return {
        id: generateId(),
        ...task,
        formattedDate: formatDate(task.createdAt)
    };
};

// Export the module components
module.exports = {
    Task,
    formatDate,
    generateId,
    createTask
}; 