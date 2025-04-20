import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ task = {}, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(task.title || '');
    const [description, setDescription] = useState(task.description || '');
    const [priority, setPriority] = useState(task.priority || 'medium');
    const [category, setCategory] = useState(task.category || 'feature');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!title.trim()) {
            alert('Title is required');
            return;
        }
        
        onSubmit({
            title,
            description,
            priority,
            category
        });
    };

    return (
        <div className="task-form-container">
            <form onSubmit={handleSubmit} className="task-form">
                <h2>{task.id ? 'Edit Task' : 'Create New Task'}</h2>
                
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task title"
                        className="form-control"
                        data-testid="task-title-input"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Task description"
                        className="form-control"
                        data-testid="task-description-input"
                        rows={3}
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="form-control"
                            data-testid="task-priority-select"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-control"
                            data-testid="task-category-select"
                        >
                            <option value="bug">Bug</option>
                            <option value="feature">Feature</option>
                            <option value="enhancement">Enhancement</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="cancel-btn"
                        data-testid="task-cancel-btn"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="submit-btn"
                        data-testid="task-submit-btn"
                    >
                        {task.id ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;