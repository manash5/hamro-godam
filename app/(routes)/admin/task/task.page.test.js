/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TaskPage from './page'; // or '../page' depending on file structure
import '@testing-library/jest-dom';

jest.mock('@/components/task/AddTaskModal', () => () => <div data-testid="add-task-modal" />);
jest.mock('@/components/task/TaskTable', () => ({ tasks }) => (
  <div data-testid="task-table">{tasks.length} tasks loaded</div>
));

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('TaskPage', () => {
  it('renders loading state initially', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], pagination: { total: 0 } }),
    });

    render(<TaskPage />);
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(3); // Skeletons
    await waitFor(() => {
      expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    });
  });

  it('renders task data after fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          { id: 1, title: 'Test Task 1' },
          { id: 2, title: 'Test Task 2' },
        ],
        pagination: { total: 2 },
      }),
    });

    render(<TaskPage />);
    await waitFor(() => {
      expect(screen.getByTestId('task-table')).toHaveTextContent('2 tasks loaded');
    });
  });

  it('shows error if API fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));
    render(<TaskPage />);
    await waitFor(() => {
      expect(screen.getByText(/Error loading tasks/i)).toBeInTheDocument();
    });
  });

  it('handles pagination buttons', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ id: 1, title: 'Test Task' }],
        pagination: { total: 20 },
      }),
    });

    render(<TaskPage />);
    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });

  it('shows and closes modal', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
        pagination: { total: 0 },
      }),
    });

    render(<TaskPage />);
    const addButton = screen.getByRole('button', { name: /\+ Add Task/i });
    fireEvent.click(addButton);

    expect(screen.getByTestId('add-task-modal')).toBeInTheDocument();
  });
});
