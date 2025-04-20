import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import io from 'socket.io-client';
import Column from './Column';
import TaskForm from './TaskForm';
import TaskProgressChart from './TaskProgressChart';
import './KanbanBoard.css';

const SOCKET_URL = 'http://localhost:5000';

function KanbanBoard() {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        done: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [formVisible, setFormVisible] = useState(false);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
            setIsConnected(false);
        });

        newSocket.on('sync:tasks', (updatedTasks) => {
            setTasks(updatedTasks);
            setIsLoading(false);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleCreateTask = (task) => {
        if (socket) {
            setIsLoading(true);
            socket.emit('task:create', { ...task, status: 'todo' });
            setFormVisible(false);
        }
    };

    const handleUpdateTask = (updatedTask) => {
        if (socket) {
            setIsLoading(true);
            socket.emit('task:update', updatedTask);
        }
    };

    const handleMoveTask = (taskId, fromStatus, toStatus) => {
        if (socket) {
            setIsLoading(true);
            socket.emit('task:move', { taskId, fromStatus, toStatus });
        }
    };

    const handleDeleteTask = (taskId, status) => {
        if (socket) {
            setIsLoading(true);
            socket.emit('task:delete', { taskId, status });
        }
    };

    const handleFileUpload = (taskId, status, file) => {
        if (socket) {
            setIsLoading(true);
            socket.emit('task:upload', { taskId, status, file });
        }
    };

    const columnNames = {
        todo: 'To Do',
        inProgress: 'In Progress',
        done: 'Done'
    };

    return (
        <div className="kanban-container">
            <header className="kanban-header">
                <h1>Kanban Board</h1>
                <div className="connection-status">
                    {isConnected ? 
                        <span className="status-connected">Connected</span> : 
                        <span className="status-disconnected">Disconnected</span>
                    }
                </div>
                <button 
                    className="add-task-btn"
                    onClick={() => setFormVisible(true)}
                >
                    Add New Task
                </button>
            </header>

            {/* Task Progress Chart */}
            <TaskProgressChart tasks={tasks} />

            {/* Kanban Board */}
            <DndProvider backend={HTML5Backend}>
                <div className="kanban-board">
                    {isLoading && <div className="loading-overlay">Syncing...</div>}
                    
                    {Object.keys(columnNames).map(status => (
                        <Column
                            key={status}
                            status={status}
                            title={columnNames[status]}
                            tasks={tasks[status] || []}
                            onMoveTask={handleMoveTask}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                            onFileUpload={handleFileUpload}
                        />
                    ))}
                </div>
            </DndProvider>

            {formVisible && (
                <div className="form-overlay">
                    <TaskForm 
                        onSubmit={handleCreateTask} 
                        onCancel={() => setFormVisible(false)} 
                    />
                </div>
            )}
        </div>
    );
}

export default KanbanBoard;