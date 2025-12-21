import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';

export const StatsCard: React.FC = () => {
  const { theme } = useTheme();
  const { tasks } = useTasks();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: theme.text }]}>
          {stats.total}
        </Text>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
          Total
        </Text>
      </View>

      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: theme.completed }]}>
          {stats.completed}
        </Text>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
          Done
        </Text>
      </View>

      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: theme.primary }]}>
          {stats.pending}
        </Text>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
          Pending
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
});