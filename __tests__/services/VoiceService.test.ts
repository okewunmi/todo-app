import { VoiceService } from '../../src/services/VoiceService';

describe('VoiceService', () => {
  describe('parseTasksFromText', () => {
    it('parses single task', () => {
      const result = VoiceService.parseTasksFromText('Buy groceries');
      expect(result).toEqual(['Buy groceries']);
    });

    it('parses multiple tasks with "and" separator', () => {
      const result = VoiceService.parseTasksFromText('Buy groceries and call mom');
      expect(result).toEqual(['Buy groceries', 'Call mom']);
    });

    it('parses multiple tasks with comma separator', () => {
      const result = VoiceService.parseTasksFromText('Email John, schedule meeting, review docs');
      expect(result).toEqual(['Email John', 'Schedule meeting', 'Review docs']);
    });

    it('removes common prefixes', () => {
      const result = VoiceService.parseTasksFromText('Add task: Buy milk');
      expect(result).toEqual(['Buy milk']);
    });

    it('capitalizes first letter', () => {
      const result = VoiceService.parseTasksFromText('buy milk and call mom');
      expect(result).toEqual(['Buy milk', 'Call mom']);
    });

    it('handles empty input', () => {
      const result = VoiceService.parseTasksFromText('');
      expect(result).toEqual(['']);
    });
  });

  describe('simulateVoiceInput', () => {
    it('returns transcribed text after delay', async () => {
      const input = 'Test input';
      const result = await VoiceService.simulateVoiceInput(input);
      expect(result).toBe(input);
    });
  });
});