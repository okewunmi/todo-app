import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/Button';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import { RenderAPI } from '@testing-library/react-native';

const renderWithTheme = (
  component: React.ReactElement
): RenderAPI => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};


describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={onPressMock} disabled />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const { rerender, getByText } = renderWithTheme(
      <Button title="Primary" onPress={() => {}} variant="primary" />
    );
    expect(getByText('Primary')).toBeTruthy();

    rerender(
      <ThemeProvider>
        <Button title="Secondary" onPress={() => {}} variant="secondary" />
      </ThemeProvider>
    );
    expect(getByText('Secondary')).toBeTruthy();

    rerender(
      <ThemeProvider>
        <Button title="Danger" onPress={() => {}} variant="danger" />
      </ThemeProvider>
    );
    expect(getByText('Danger')).toBeTruthy();
  });
});
