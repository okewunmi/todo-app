import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Calendar } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

type RootStackParamList = {
  TaskList: undefined;
  AddTask: undefined;
};

type AddTaskScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddTask'
>;

interface AddTaskScreenProps {
  navigation: AddTaskScreenNavigationProp;
}

export const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { addTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [errors, setErrors] = useState<{ title?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      dueDate: dueDate?.getTime(),
    });

    navigation.goBack();
  };

  const handleCancel = () => {
    if (title.trim() || description.trim()) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard this task?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const selectDueDate = () => {
    // Simplified date picker - in production use @react-native-community/datetimepicker
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDueDate(tomorrow);
    Alert.alert('Date Selected', `Due date set to ${tomorrow.toLocaleDateString()}`);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title="Add Task"
        rightComponent={
          <Button
            title="Cancel"
            variant="secondary"
            onPress={handleCancel}
            style={styles.cancelButton}
          />
        }
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Input
          testID="task-title-input"
          label="Task Title *"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          error={errors.title}
        />

        <Input
          testID="task-description-input"
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description"
          multiline
          style={styles.descriptionInput}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>
            Due Date (Optional)
          </Text>
          <TouchableOpacity
            testID="select-due-date"
            style={[
              styles.dateButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={selectDueDate}
          >
            <Calendar size={20} color={theme.primary} />
            <Text style={[styles.dateText, { color: theme.text }]}>
              {dueDate
                ? dueDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Select due date'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            testID="save-task-button"
            title="Save Task"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 12,
  },
  buttonContainer: {
    marginTop: 24,
  },
  saveButton: {
    width: '100%',
  },
});