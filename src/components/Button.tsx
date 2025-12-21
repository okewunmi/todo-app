import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  icon,
  testID,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: theme.primary,
      borderWidth: 0,
    };

    if (variant === 'secondary') {
      return {
        ...base,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.border,
      };
    }

    if (variant === 'danger') {
      return {
        ...base,
        backgroundColor: theme.danger,
      };
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    if (variant === 'secondary') {
      return { color: theme.text };
    }
    return { color: '#FFFFFF' };
  };

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <>{icon}</>}
      <Text style={[styles.text, getTextStyle()]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
