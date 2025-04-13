// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    completed: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    if (editingId !== null) {
      // Update existing task
      setTasks(tasks.map((task) => (task.id === editingId ? { ...newTask, id: editingId } : task)));
      setEditingId(null);
    } else {
      // Add new task
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
    }

    // Reset form
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      completed: false,
    });
    setIsFormVisible(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (task) => {
    setNewTask({ ...task });
    setEditingId(task.id);
    setIsFormVisible(true);
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const cancelEdit = () => {
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      completed: false,
    });
    setEditingId(null);
    setIsFormVisible(false);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  };

  return (
    <div className="task-manager">
      <header className="header">
        <h1>Task Manager</h1>
        <button 
          className="add-button" 
          onClick={() => setIsFormVisible(true)}
          style={{ display: isFormVisible ? 'none' : 'block' }}
        >
          + New Task
        </button>
      </header>

      {isFormVisible && (
        <div className="task-form-container">
          <form className="task-form" onSubmit={addTask}>
            <h2>{editingId !== null ? 'Edit Task' : 'Add New Task'}</h2>
            
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="Task title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Task description"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dueDate">Due Date:</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority:</label>
                <select
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={cancelEdit}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                {editingId !== null ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="task-list-container">
        <h2>My Tasks</h2>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Add a task to get started!</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`task-card ${task.completed ? 'completed' : ''}`}
              >
                <div className="task-header">
                  <div className="task-checkbox">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      id={`task-${task.id}`}
                    />
                    <label 
                      htmlFor={`task-${task.id}`}
                      className={task.completed ? 'completed' : ''}
                    >
                      {task.title}
                    </label>
                  </div>
                  <div className={`priority-badge ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </div>
                </div>
                
                {task.description && (
                  <div className="task-description">{task.description}</div>
                )}
                
                {task.dueDate && (
                  <div className="task-due-date">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
                
                <div className="task-actions">
                  <button 
                    className="edit-button" 
                    onClick={() => editTask(task)}
                    disabled={isFormVisible}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button" 
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;