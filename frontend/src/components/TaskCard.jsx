import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import TaskEditForm from './TaskEditForm';
import './TaskCard.css';

const TaskCard = ({ task, onUpdate, onDelete, onFileUpload }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task.id, status: task.status },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleUpdate = (updatedTask) => {
        onUpdate({ ...task, ...updatedTask });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            onFileUpload(file);
        }
    };

    // Priority styles and labels
    const priorityInfo = {
        low: { class: 'priority-low', label: 'Low' },
        medium: { class: 'priority-medium', label: 'Medium' },
        high: { class: 'priority-high', label: 'High' }
    };

    const priorityClass = priorityInfo[task.priority?.toLowerCase()] || priorityInfo.medium;

    // Category display
    const categoryLabel = task.category || 'Uncategorized';

    if (isEditing) {
        return (
            <TaskEditForm 
                task={task} 
                onSubmit={handleUpdate} 
                onCancel={handleCancel}
            />
        );
    }

    return (
        <div 
            ref={drag}
            className={`task-card ${priorityClass.class} ${isDragging ? 'dragging' : ''}`}
            data-testid={`task-${task.id}`}
        >
            <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-actions">
                    <button className="edit-btn" onClick={handleEdit}>Edit</button>
                    <button className="delete-btn" onClick={onDelete}>Delete</button>
                </div>
            </div>

            <div className="task-body">
                <p className="task-description">{task.description}</p>
                
                <div className="task-metadata">
                    <div className="task-priority">
                        <span className="metadata-label">Priority:</span>
                        <span className={`priority-badge ${priorityClass.class}`}>
                            {priorityClass.label}
                        </span>
                    </div>
                    
                    <div className="task-category">
                        <span className="metadata-label">Category:</span>
                        <span className="category-badge">{categoryLabel}</span>
                    </div>
                </div>

                {task.attachments && task.attachments.length > 0 && (
                    <div className="task-attachments">
                        <h4>Attachments</h4>
                        <ul className="attachment-list">
                            {task.attachments.map(attachment => (
                                <li key={attachment.id} className="attachment-item">
                                    {attachment.filename.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                        <div className="image-preview">
                                            <img 
                                                src={attachment.url} 
                                                alt={attachment.filename}
                                                className="attachment-thumbnail"
                                            />
                                        </div>
                                    ) : (
                                        <span className="file-icon">📄</span>
                                    )}
                                    <span className="file-name">{attachment.filename}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="task-upload">
                    <label className="upload-btn">
                        Add Attachment
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="file-input"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;