export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
}

export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  completed: string;
  danger: string;
  fabBackground: string;
  modalBackground: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearCompleted: () => void;
}