import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "../types";
import { parseTaskText } from "../utils/task";

type TaskState = {
  tasks: Task[];
  addTask: (text: string, categoryId: string) => void;
  toggleComplete: (id: number) => void;
  removeTaskById: (id: number) => void;
  removeTasksByCategory: (categoryId: string) => void;
  getTasksByCategory: (categoryId: string | null) => Task[];
  updateTask: (id: number, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: number) => void;
  setTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      setTasks: (tasks) => set({ tasks }),

      addTask: (text, categoryId) => {
        if (!text.trim()) return;

        const { text: taskText } = parseTaskText(text);

        const newTask: Task = {
          id: Date.now(),
          text: taskText,
          categoryId,
          completed: false,
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      toggleComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },

      removeTaskById: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      removeTasksByCategory: (categoryId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.categoryId !== categoryId),
        }));
      },

      getTasksByCategory: (categoryId) => {
        const { tasks } = get();
        return categoryId
          ? tasks.filter((task) => task.categoryId === categoryId)
          : tasks;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
    }),
    {
      name: "task-store",
    }
  )
);
