import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import KanbanBoard from "../../components/KanbanBoard";
import io from 'socket.io-client';

// Mock Socket.io
vi.mock('socket.io-client');

// Mock react-dnd
vi.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, vi.fn()],
  useDrop: () => [{ isOver: false }, vi.fn()],
  DndProvider: ({ children }) => children,
}));

// Setup mock socket events and responses
const setupMockSocket = () => {
  let taskState = {
    todo: [],
    inProgress: [],
    done: []
  };
  
  const mockSocket = {
    on: vi.fn((event, callback) => {
      if (event === 'sync:tasks') {
        mockSocket.syncCallback = callback;
      }
      if (event === 'connect') {
        mockSocket.connectCallback = callback;
      }
    }),
    emit: vi.fn((event, payload) => {
      // Simulate server responses
      if (event === 'task:create') {
        const newTask = {
          id: 'test-id-1',
          title: payload.title,
          description: payload.description,
          priority: payload.priority,
          category: payload.category,
          status: payload.status,
          createdAt: new Date().toISOString()
        };
        
        taskState[payload.status].push(newTask);
        
        // Simulate server sync response
        setTimeout(() => mockSocket.syncCallback(taskState), 0);
      }
      
      if (event === 'task:move') {
        const { taskId, fromStatus, toStatus } = payload;
        const taskIndex = taskState[fromStatus].findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
          const task = { ...taskState[fromStatus][taskIndex], status: toStatus };
          taskState[fromStatus].splice(taskIndex, 1);
          taskState[toStatus].push(task);
          
          // Simulate server sync response
          setTimeout(() => mockSocket.syncCallback(taskState), 0);
        }
      }
    }),
    disconnect: vi.fn(),
    connectCallback: null,
    syncCallback: null
  };
  
  return mockSocket;
};

describe('Task Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configure mock socket
    const mockSocket = setupMockSocket();
    io.mockReturnValue(mockSocket);
  });

  it('should create a task and update the board', async () => {
    render(<KanbanBoard />);
    
    // Simulate socket connection
    act(() => {
      io().connectCallback();
    });
    
    // Open the task form
    fireEvent.click(screen.getByText('Add New Task'));
    
    // Fill out the form
    const titleInput = screen.getByTestId('task-title-input');
    const descInput = screen.getByTestId('task-description-input');
    const prioritySelect = screen.getByTestId('task-priority-select');
    const categorySelect = screen.getByTestId('task-category-select');
    
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descInput, { target: { value: 'Test Description' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.change(categorySelect, { target: { value: 'bug' } });
    
    // Submit the form
    fireEvent.click(screen.getByTestId('task-submit-btn'));
    
    // Wait for the task to be added to the board
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
    
    // Verify socket emitted correct events
    expect(io().emit).toHaveBeenCalledWith('task:create', {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      category: 'bug',
      status: 'todo'
    });
  });

  it('should update task counts in the progress chart', async () => {
    render(<KanbanBoard />);
    
    // Simulate initial socket connection and task state
    act(() => {
      io().connectCallback();
      io().syncCallback({
        todo: [{ id: 'task1', title: 'Task 1', status: 'todo' }],
        inProgress: [{ id: 'task2', title: 'Task 2', status: 'inProgress' }],
        done: [{ id: 'task3', title: 'Task 3', status: 'done' }]
      });
    });
    
    // Check task counts in chart
    await waitFor(() => {
      const todoCount = screen.getByText('1', { selector: '.todo-count' });
      const inProgressCount = screen.getByText('1', { selector: '.in-progress-count' });
      const doneCount = screen.getByText('1', { selector: '.done-count' });
      
      expect(todoCount).toBeInTheDocument();
      expect(inProgressCount).toBeInTheDocument();
      expect(doneCount).toBeInTheDocument();
    });
  });
});