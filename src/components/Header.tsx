import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, rightComponent }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderBottomColor: theme.border },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      
      <View style={styles.rightSection}>
        {rightComponent}
        <TouchableOpacity
          onPress={toggleTheme}
          style={styles.themeButton}
          testID="theme-toggle"
        >
          {isDark ? (
            <Sun size={24} color={theme.text} />
          ) : (
            <Moon size={24} color={theme.text} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeButton: {
    padding: 8,
    marginLeft: 8,
  },
});
