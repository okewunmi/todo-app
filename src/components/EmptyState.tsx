import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  testID?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon,
  testID,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container} testID={testID}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
