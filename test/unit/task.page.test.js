/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TaskAssignmentPage from '../../../app/(routes)/task/page'; // Adjust path as needed
import '@testing-library/jest-dom';

// Mock components
jest.mock('../../../components/ui/sidebar/sidebar', () => () => <div data-testid="sidebar" />);
jest.mock('../../../components/task/Task', () => () => <div data-testid="task-component" />);

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('TaskAssignmentPage', () => {
  it('renders loading state initially', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], pagination: { total: 0 } }),
    });
    render(<TaskAssignmentPage />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  
});