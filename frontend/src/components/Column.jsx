import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import './Column.css';

const Column = ({ status, title, tasks, onMoveTask, onUpdateTask, onDeleteTask, onFileUpload }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'TASK',
        drop: (item) => {
            if (item.status !== status) {
                onMoveTask(item.id, item.status, status);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div 
            ref={drop}
            className={`column ${isOver ? 'column-highlight' : ''}`}
            data-testid={`column-${status}`}
        >
            <h2 className="column-title">{title} <span className="task-count">{tasks.length}</span></h2>
            <div className="tasks-container">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onUpdate={onUpdateTask}
                        onDelete={() => onDeleteTask(task.id, status)}
                        onFileUpload={(file) => onFileUpload(task.id, status, file)}
                    />
                ))}
                {tasks.length === 0 && (
                    <div className="empty-column">No tasks</div>
                )}
            </div>
        </div>
    );
};

export default Column;