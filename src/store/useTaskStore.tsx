import { create } from "zustand";
import { Task } from "../types";
import { parseTaskText } from "../utils/task";
import { tasksApi } from "../services/api";

type TaskState = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (categoryId?: number) => Promise<void>;
  addTask: (text: string, categoryId: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;
  removeTaskById: (id: number) => Promise<void>;
  removeTasksByCategory: (categoryId: string) => void;
  getTasksByCategory: (categoryId: string | null) => Task[];
  updateTask: (id: number, updates: Partial<Omit<Task, "id">>) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (categoryId?: number) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await tasksApi.getAll(categoryId);
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error("Error loading tasks:", error);
      set({ error: "Unable to load tasks", isLoading: false });
    }
  },

  setTasks: (tasks) => set({ tasks }),

  addTask: async (text, categoryId) => {
    if (!text.trim()) return;
    const { text: taskText } = parseTaskText(text);
    try {
      const apiTask = await tasksApi.create(taskText, categoryId, false);
      set((state) => ({ tasks: [...state.tasks, apiTask] }));
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  toggleComplete: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newCompletedState = !task.completed;
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: newCompletedState } : t
      ),
    }));

    try {
      await tasksApi.update(id, { is_completed: newCompletedState });
    } catch (error) {
      console.error("Error updating task:", error);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, completed: !newCompletedState } : t
        ),
      }));
    }
  },

  removeTaskById: async (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    try {
      await tasksApi.delete(id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },

  removeTasksByCategory: (categoryId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.categoryId !== categoryId),
    }));
  },

  getTasksByCategory: (categoryId) => {
    const { tasks } = get();
    return categoryId ? tasks.filter((t) => t.categoryId === categoryId) : tasks;
  },

  updateTask: async (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    if (updates.text) {
      try {
        await tasksApi.update(id, { title: updates.text });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  },
}));
