// src/services/VoiceService.ts
import axios from 'axios';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ;
const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

export const VoiceService = {
  recording: null as Audio.Recording | null,

  requestPermissions: async (): Promise<boolean> => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      return permission.granted;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  },

  
  cleanup: async (): Promise<void> => {
    try {
      if (VoiceService.recording) {
        console.log('Cleaning up existing recording...');
        try {
          await VoiceService.recording.stopAndUnloadAsync();
        } catch (e) {
          console.log('Recording already stopped');
        }
        VoiceService.recording = null;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  },

  startRecording: async (): Promise<Audio.Recording> => {
    try {
      console.log('Requesting permissions..');
      const hasPermission = await VoiceService.requestPermissions();
      
      if (!hasPermission) {
        throw new Error('Microphone permission not granted');
      }

      // IMPORTANT: Cleanup first
      await VoiceService.cleanup();

      console.log('Setting audio mode..');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Creating recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      VoiceService.recording = recording;
      console.log('Recording started successfully');
      
      return recording;
    } catch (err) {
      console.error('Failed to start recording', err);
      await VoiceService.cleanup();
      throw err;
    }
  },

  stopRecording: async (): Promise<string> => {
    try {
      if (!VoiceService.recording) {
        throw new Error('No recording in progress');
      }

      console.log('Stopping recording..');
      
      await VoiceService.recording.stopAndUnloadAsync();
      const uri = VoiceService.recording.getURI();
      
      VoiceService.recording = null;
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      if (!uri) {
        throw new Error('No recording URI');
      }

      console.log('Recording stopped at', uri);
      return uri;
    } catch (err) {
      console.error('Failed to stop recording', err);
      await VoiceService.cleanup();
      throw err;
    }
  },

  transcribeAudio: async (audioUri: string): Promise<string> => {
    try {
      console.log('Transcribing audio from:', audioUri);

      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'audio.m4a',
      } as any);
      
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      
      const response = await axios.post(OPENAI_API_URL, formData, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      console.log('Transcription result:', response.data.text);
      return response.data.text;
    } catch (error: any) {
      console.error('Transcription error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
      
      throw new Error(error.response?.data?.error?.message || 'Failed to transcribe');
    }
  },

  parseTasksFromText: (text: string): string[] => {
    const cleaned = text
      .replace(/^(add|create|make|new)\s+(task|tasks|todo|to-do)?\s*:?\s*/i, '')
      .trim();

    const separators = /\s+and\s+|\s*,\s*|\s+then\s+|\s*;\s*/gi;
    const tasks = cleaned
      .split(separators)
      .map(task => {
        const trimmed = task.trim();
        if (trimmed.length === 0) return '';
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      })
      .filter(task => task.length > 0);

    return tasks.length > 0 ? tasks : [cleaned];
  },

  speak: (text: string) => {
    Speech.speak(text, { language: 'en', pitch: 1, rate: 1 });
  },

  stop: () => {
    Speech.stop();
  },

};

