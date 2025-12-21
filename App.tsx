import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { TaskProvider } from './src/contexts/TaskContext';
import { TaskListScreen } from './src/screens/TaskListScreen';
import { AddTaskScreen } from './src/screens/AddTaskScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="TaskList" component={TaskListScreen} />
            <Stack.Screen
              name="AddTask"
              component={AddTaskScreen}
              options={{
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TaskProvider>
    </ThemeProvider>
  );
}
