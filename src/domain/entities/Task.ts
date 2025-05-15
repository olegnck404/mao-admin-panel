export interface Task {
  id?: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Done';
  isGlobal: boolean;
  assignees: string[]; // user IDs or names
}