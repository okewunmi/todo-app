import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../../src/services/StorageService';

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveTasks and loadTasks', () => {
    it('saves and loads tasks correctly', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Test Task',
          completed: false,
          createdAt: Date.now(),
        },
      ];

      await StorageService.saveTasks(tasks);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@todo_tasks',
        JSON.stringify(tasks)
      );
    });

    it('returns empty array when no tasks exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const tasks = await StorageService.loadTasks();
      expect(tasks).toEqual([]);
    });

    it('loads tasks from storage', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task',
          completed: false,
          createdAt: Date.now(),
        },
      ];
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockTasks)
      );
      
      const tasks = await StorageService.loadTasks();
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe('saveTheme and loadTheme', () => {
    it('saves and loads theme preference', async () => {
      await StorageService.saveTheme(true);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@todo_theme',
        JSON.stringify(true)
      );
    });

    it('returns false when no theme is saved', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const isDark = await StorageService.loadTheme();
      expect(isDark).toBe(false);
    });

    it('loads saved theme', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(true)
      );
      
      const isDark = await StorageService.loadTheme();
      expect(isDark).toBe(true);
    });
  });

  describe('clearAll', () => {
    it('clears all stored data', async () => {
      await StorageService.clearAll();
      
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@todo_tasks',
        '@todo_theme',
      ]);
    });
  });
});