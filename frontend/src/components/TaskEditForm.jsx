import React, { useState } from 'react';
import './TaskEditForm.css';

const TaskEditForm = ({ task, onSubmit, onCancel }) => {
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
        <div className="task-edit-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task title"
                        className="form-control"
                        data-testid="edit-title-input"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Task description"
                        className="form-control"
                        data-testid="edit-description-input"
                        rows={2}
                    />
                </div>
                
                <div className="form-inline">
                    <div className="form-group">
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="form-control"
                            data-testid="edit-priority-select"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-control"
                            data-testid="edit-category-select"
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
                        className="cancel-edit-btn"
                        data-testid="edit-cancel-btn"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="save-edit-btn"
                        data-testid="edit-save-btn"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskEditForm;