import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Circle, Trash2 } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  testID?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  testID,
}) => {
  const { theme } = useTheme();

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <TouchableOpacity
        testID={`${testID}-toggle`}
        style={styles.checkbox}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
      >
        {task.completed ? (
          <Check size={20} color={theme.completed} strokeWidth={3} />
        ) : (
          <Circle size={20} color={theme.textSecondary} />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          testID={`${testID}-title`}
          style={[
            styles.title,
            { color: theme.text },
            task.completed && styles.completedText,
          ]}
        >
          {task.title}
        </Text>
        
        {task.description && (
          <Text
            testID={`${testID}-description`}
            style={[styles.description, { color: theme.textSecondary }]}
          >
            {task.description}
          </Text>
        )}

        {task.dueDate && (
          <Text
            testID={`${testID}-dueDate`}
            style={[styles.dueDate, { color: theme.textSecondary }]}
          >
            Due: {formatDate(task.dueDate)}
          </Text>
        )}
      </View>

      <TouchableOpacity
        testID={`${testID}-delete`}
        onPress={() => onDelete(task.id)}
        style={styles.deleteButton}
        activeOpacity={0.7}
      >
        <Trash2 size={20} color={theme.danger} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  dueDate: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
});