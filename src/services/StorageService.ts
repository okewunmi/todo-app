import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const STORAGE_KEY = '@todo_tasks';
const THEME_KEY = '@todo_theme';

export const StorageService = {
  /**
   * Save tasks to AsyncStorage
   */
  saveTasks: async (tasks: Task[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw new Error('Failed to save tasks');
    }
  },

  /**
   * Load tasks from AsyncStorage
   */
  loadTasks: async (): Promise<Task[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  /**
   * Save theme preference
   */
  saveTheme: async (isDark: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDark));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },

  /**
   * Load theme preference
   */
  loadTheme: async (): Promise<boolean> => {
    try {
      const theme = await AsyncStorage.getItem(THEME_KEY);
      return theme ? JSON.parse(theme) : false;
    } catch (error) {
      console.error('Error loading theme:', error);
      return false;
    }
  },

  /**
   * Clear all data (useful for testing)
   */
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY, THEME_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};