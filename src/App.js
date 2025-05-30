import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    completed: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock function to fetch tasks - replace with actual API call
  const fetchTasks = async () => {
    // This would be an API call in a real application
    return [];
  };

  // Mock function to create a task - replace with actual API call
  const createTask = async (task) => {
    // This would be an API call in a real application
    return {
      _id: Date.now().toString(),
      ...task,
      createdAt: new Date()
    };
  };

  // Mock function to update a task - replace with actual API call
  const updateTask = async (id, task) => {
    // This would be an API call in a real application
    return {
      _id: id,
      ...task,
      updatedAt: new Date()
    };
  };

  // Mock function to delete a task - replace with actual API call
  const deleteTask = async (id) => {
    // This would be an API call in a real application
    return true;
  };

  // Mock function to toggle task completion - replace with actual API call
  const toggleTaskCompletion = async (id) => {
    // Find the task in the current state
    const task = tasks.find(task => task._id === id);
    if (!task) return null;
    
    // Toggle completion status
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: new Date()
    };
    
    // This would be an API call in a real application
    return updatedTask;
  };

  // Fetch all tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        setError('Failed to load tasks. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      setIsLoading(true);
      
      if (editingId !== null) {
        // Update existing task
        const updatedTask = await updateTask(editingId, newTask);
        setTasks(tasks.map((task) => (task._id === editingId ? updatedTask : task)));
        setEditingId(null);
      } else {
        // Add new task
        const createdTask = await createTask(newTask);
        setTasks([createdTask, ...tasks]);
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
      setError(null);
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setIsLoading(true);
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      priority: task.priority,
      completed: task.completed,
    });
    setEditingId(task._id);
    setIsFormVisible(true);
  };

  const handleToggleComplete = async (id) => {
    try {
      setIsLoading(true);
      const updatedTask = await toggleTaskCompletion(id);
      setTasks(
        tasks.map((task) =>
          task._id === id ? updatedTask : task
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        >
          + New Task
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

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
                disabled={isLoading}
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
                disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority:</label>
                <select
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={cancelEdit}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (editingId !== null ? 'Update Task' : 'Add Task')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="task-list-container">
        <h2>My Tasks</h2>
        {isLoading && tasks.length === 0 ? (
          <p className="loading-message">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Add a task to get started!</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div 
                key={task._id} 
                className={`task-card ${task.completed ? 'completed' : ''}`}
              >
                <div className="task-header">
                  <div className="task-checkbox">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task._id)}
                      id={`task-${task._id}`}
                      disabled={isLoading}
                    />
                    <label 
                      htmlFor={`task-${task._id}`}
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
                    onClick={() => handleEditTask(task)}
                    disabled={isLoading || isFormVisible}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button" 
                    onClick={() => handleDeleteTask(task._id)}
                    disabled={isLoading}
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