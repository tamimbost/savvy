import { readLS, writeLS } from '../lib/storage';
import { format } from 'date-fns';

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'Completed';

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string; // ISO
  status: TaskStatus;
  createdAt: string; // ISO
  completedAt?: string; // ISO
};

const KEY = 'tasks_data';

export function listTasks(): Task[] {
  return readLS<Task[]>(KEY, []);
}

export function saveTasks(tasks: Task[]) {
  writeLS(KEY, tasks);
}

export function addTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
  const tasks = listTasks();
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  saveTasks([newTask, ...tasks]);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = listTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const updated: Task = { ...tasks[idx], ...updates };
  tasks[idx] = updated;
  saveTasks(tasks);
  return updated;
}

export function removeTask(id: string) {
  const tasks = listTasks().filter(t => t.id !== id);
  saveTasks(tasks);
}

export function bulkRemove(ids: string[]) {
  const set = new Set(ids);
  const tasks = listTasks().filter(t => !set.has(t.id));
  saveTasks(tasks);
}

export function markCompleted(id: string) {
  return updateTask(id, { status: 'Completed', completedAt: new Date().toISOString() });
}

export function tasksCompletedByDay7(): { date: string; count: number }[] {
  const tasks = listTasks();
  const map = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    map.set(format(d, 'yyyy-MM-dd'), 0);
  }
  tasks.forEach(t => {
    if (t.status === 'Completed' && t.completedAt) {
      const key = format(new Date(t.completedAt), 'yyyy-MM-dd');
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    }
  });
  return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
}

