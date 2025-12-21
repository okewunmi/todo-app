import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TaskItem } from '../../src/components/TaskItem';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import { Task } from '../../src/types';
import { RenderAPI } from '@testing-library/react-native';

const renderWithTheme = (
  component: React.ReactElement
): RenderAPI => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('TaskItem Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: Date.now(),
  };

  it('renders task title and description', () => {
    const { getByText } = renderWithTheme(
      <TaskItem
        task={mockTask}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    );

    expect(getByText('Test Task')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('calls onToggle when checkbox is pressed', () => {
    const onToggleMock = jest.fn();
    const { getByTestId } = renderWithTheme(
      <TaskItem
        task={mockTask}
        onToggle={onToggleMock}
        onDelete={() => {}}
        testID="task-item"
      />
    );

    fireEvent.press(getByTestId('task-item-toggle'));
    expect(onToggleMock).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is pressed', () => {
    const onDeleteMock = jest.fn();
    const { getByTestId } = renderWithTheme(
      <TaskItem
        task={mockTask}
        onToggle={() => {}}
        onDelete={onDeleteMock}
        testID="task-item"
      />
    );

    fireEvent.press(getByTestId('task-item-delete'));
    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });

  it('shows completed state correctly', () => {
    const completedTask = { ...mockTask, completed: true };
    const { getByTestId } = renderWithTheme(
      <TaskItem
        task={completedTask}
        onToggle={() => {}}
        onDelete={() => {}}
        testID="task-item"
      />
    );

    const title = getByTestId('task-item-title');
    expect(title.props.style).toContainEqual(
      expect.objectContaining({ textDecorationLine: 'line-through' })
    );
  });
});