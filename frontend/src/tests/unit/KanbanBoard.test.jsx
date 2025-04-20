import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';

// Mock Socket.io
vi.mock('socket.io-client', () => {
  const socket = {
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  };
  return {
    default: vi.fn(() => socket)
  };
});

// Mock react-dnd
vi.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, vi.fn()],
  useDrop: () => [{ isOver: false }, vi.fn()],
  DndProvider: ({ children }) => children,
}));

describe('KanbanBoard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Kanban board with column headers', () => {
    render(<KanbanBoard />);
    
    expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows the add task button', () => {
    render(<KanbanBoard />);
    
    const addButton = screen.getByText('Add New Task');
    expect(addButton).toBeInTheDocument();
  });

  it('shows the task form when add button is clicked', () => {
    render(<KanbanBoard />);
    
    const addButton = screen.getByText('Add New Task');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByTestId('task-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('task-description-input')).toBeInTheDocument();
    expect(screen.getByTestId('task-priority-select')).toBeInTheDocument();
    expect(screen.getByTestId('task-category-select')).toBeInTheDocument();
  });

  it('hides the task form when cancel is clicked', () => {
    render(<KanbanBoard />);
    
    // Open the form
    const addButton = screen.getByText('Add New Task');
    fireEvent.click(addButton);
    
    // Click cancel
    const cancelButton = screen.getByTestId('task-cancel-btn');
    fireEvent.click(cancelButton);
    
    // Form should no longer be visible
    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });
});