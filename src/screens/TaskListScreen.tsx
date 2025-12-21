import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Plus, Mic, X, Square } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { TaskItem } from '../components/TaskItem';
import { FAB } from '../components/FAB';
import { EmptyState } from '../components/EmptyState';
import { Input } from '../components/Input';
import { VoiceService } from '../services/VoiceService';
import { FilterType } from '../types';

type RootStackParamList = {
  TaskList: undefined;
  AddTask: undefined;
};

type TaskListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TaskList'
>;

interface TaskListScreenProps {
  navigation: TaskListScreenNavigationProp;
}

export const TaskListScreen: React.FC<TaskListScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { tasks, toggleTask, deleteTask, addTask } = useTasks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed);

    return matchesSearch && matchesFilter;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return b.createdAt - a.createdAt;
    }
    return a.completed ? 1 : -1;
  });

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) },
      ]
    );
  };

  const handleVoiceInput = async () => {
    console.log('=== Voice button pressed ===');
    console.log('Current modal state:', showVoiceModal);
    
    try {
      console.log('Opening modal...');
      setShowVoiceModal(true);
      console.log('Modal should now be visible');
      
      setIsRecording(true);
      setRecordingDuration(0);

      console.log('Attempting to start recording...');
      await VoiceService.startRecording();
      console.log('Recording started');

      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      (global as any).recordingInterval = interval;

    } catch (error: any) {
      console.error('Recording error:', error);
      setShowVoiceModal(false);
      setIsRecording(false);
      Alert.alert('Error', error.message || 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if ((global as any).recordingInterval) {
        clearInterval((global as any).recordingInterval);
        (global as any).recordingInterval = null;
      }

      setIsRecording(false);
      setIsProcessing(true);

      const audioUri = await VoiceService.stopRecording();
      console.log('Audio URI:', audioUri);

      const transcribedText = await VoiceService.transcribeAudio(audioUri);
      console.log('Transcribed:', transcribedText);

      const parsedTasks = VoiceService.parseTasksFromText(transcribedText);
      console.log('Parsed tasks:', parsedTasks);

      parsedTasks.forEach(title => {
        addTask({ title, completed: false });
      });

      setIsProcessing(false);
      setShowVoiceModal(false);
      setRecordingDuration(0);

      Alert.alert(
        'Success!',
        `Added ${parsedTasks.length} task(s):\n\n${parsedTasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}`,
        [{ text: 'OK' }]
      );

    } catch (error: any) {
      console.error('Processing error:', error);
      setIsProcessing(false);
      setShowVoiceModal(false);
      setRecordingDuration(0);
      Alert.alert('Error', error.message || 'Failed to process voice input');
    }
  };

 const cancelRecording = async () => {
  console.log('Canceling...');
  
  if ((global as any).recordingInterval) {
    clearInterval((global as any).recordingInterval);
    (global as any).recordingInterval = null;
  }

  // Use cleanup method instead
  await VoiceService.cleanup();

  setIsRecording(false);
  setIsProcessing(false);
  setShowVoiceModal(false);
  setRecordingDuration(0);
};

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  console.log('Render - showVoiceModal:', showVoiceModal);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="My Tasks" />
      <StatsCard />

      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tasks..."
        />
        
        <View style={styles.filterButtons}>
          {(['all', 'active', 'completed'] as FilterType[]).map(filterType => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterButton,
                { borderColor: theme.border },
                filter === filterType && { backgroundColor: theme.primary },
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  { color: filter === filterType ? '#FFFFFF' : theme.text },
                ]}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {sortedTasks.length === 0 ? (
        <EmptyState
          message={searchQuery ? 'No tasks found' : 'No tasks yet. Tap + to add one!'}
        />
      ) : (
        <FlatList
          data={sortedTasks}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={toggleTask}
              onDelete={handleDelete}
              testID={`task-${item.id}`}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.taskList}
        />
      )}

      <FAB
        testID="add-task-fab"
        onPress={() => navigation.navigate('AddTask')}
        icon={<Plus size={28} color="#FFFFFF" />}
        style={{ right: 20, bottom: 20 }}
      />

      <FAB
        testID="voice-fab"
        onPress={handleVoiceInput}
        icon={<Mic size={24} color="#FFFFFF" />}
        backgroundColor="#FF3B30"
        style={{ right: 20, bottom: 90 }}
      />

      {/* TEST: Simple Modal that should always show */}
      <Modal
        visible={showVoiceModal}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelRecording}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.voiceModal, { backgroundColor: theme.card }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={cancelRecording}
            >
              <X size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            <View
              style={[
                styles.micIcon,
                isRecording && styles.micIconRecording,
                isProcessing && styles.micIconProcessing,
              ]}
            >
              <Mic 
                size={48} 
                color={
                  isRecording ? '#FF3B30' : 
                  isProcessing ? theme.primary : 
                  theme.textSecondary
                } 
              />
            </View>

            <Text style={[styles.voiceText, { color: theme.text }]}>
              {isRecording && 'Listening...'}
              {isProcessing && 'Processing...'}
              {!isRecording && !isProcessing && 'Ready'}
            </Text>

            {isRecording && (
              <>
                <Text style={[styles.durationText, { color: '#FF3B30' }]}>
                  {formatDuration(recordingDuration)}
                </Text>
                <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
                  Speak your tasks clearly.{'\n'}
                  Separate tasks with "and" or commas.
                </Text>
              </>
            )}

            {isProcessing && (
              <ActivityIndicator
                size="large"
                color={theme.primary}
                style={styles.spinner}
              />
            )}

            {isRecording && (
              <TouchableOpacity
                style={[styles.stopButton, { backgroundColor: '#FF3B30' }]}
                onPress={stopRecording}
              >
                <Square size={24} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.stopButtonText}>Stop & Process</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  taskList: {
    padding: 16,
    paddingBottom: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  voiceModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  micIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginBottom: 20,
  },
  micIconRecording: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  micIconProcessing: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  voiceText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  durationText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  spinner: {
    marginTop: 20,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});