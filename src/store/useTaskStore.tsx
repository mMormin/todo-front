import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "../types";
import { parseTaskText } from "../utils/task";
import { tasksApi } from "../services/api";

type TaskState = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (categoryId?: number) => Promise<void>;
  addTask: (
    text: string,
    categoryId: string,
    apiCategoryId?: number
  ) => Promise<void>;
  toggleComplete: (id: number, apiId?: number) => Promise<void>;
  removeTaskById: (id: number, apiId?: number) => Promise<void>;
  removeTasksByCategory: (categoryId: string) => void;
  getTasksByCategory: (categoryId: string | null) => Task[];
  updateTask: (
    id: number,
    updates: Partial<Omit<Task, "id">>,
    apiId?: number
  ) => Promise<void>;
  deleteTask: (id: number, apiId?: number) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
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
          set({
            error: "Unable to load tasks",
            isLoading: false,
          });
        }
      },

      setTasks: (tasks) => set({ tasks }),

      addTask: async (text, categoryId, apiCategoryId) => {
        if (!text.trim()) return;

        const { text: taskText } = parseTaskText(text);

        const newTask: Task = {
          id: Date.now(),
          text: taskText,
          categoryId,
          completed: false,
        };

        // Add locally first for immediate reactivity
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        // Then sync with API if possible
        if (apiCategoryId) {
          try {
            const apiTask = await tasksApi.create(
              taskText,
              apiCategoryId,
              false
            );

            // Update task with API response data
            set((state) => ({
              tasks: state.tasks.map((task) =>
                task.id === newTask.id ? { ...task, ...apiTask } : task
              ),
            }));
          } catch (error) {
            console.error("Error creating task:", error);
            // Task remains local even if API fails
          }
        }
      },

      toggleComplete: async (id, apiId) => {
        // Immediate local update
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const newCompletedState = !task.completed;

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: newCompletedState } : task
          ),
        }));

        // Sync with API
        if (apiId) {
          try {
            await tasksApi.update(apiId, { is_completed: newCompletedState });
          } catch (error) {
            console.error("Error updating task:", error);
            // Rollback on error
            set((state) => ({
              tasks: state.tasks.map((task) =>
                task.id === id
                  ? { ...task, completed: !newCompletedState }
                  : task
              ),
            }));
          }
        }
      },

      removeTaskById: async (id, apiId) => {
        // Immediate local deletion
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));

        // Sync with API
        if (apiId) {
          try {
            await tasksApi.delete(apiId);
          } catch (error) {
            console.error("Error deleting task:", error);
          }
        }
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

      updateTask: async (id, updates, apiId) => {
        // Immediate local update
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));

        // Sync with API
        if (apiId && updates.text) {
          try {
            await tasksApi.update(apiId, { description: updates.text });
          } catch (error) {
            console.error("Error updating task:", error);
          }
        }
      },

      deleteTask: async (id, apiId) => {
        // Immediate local deletion
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));

        // Sync with API
        if (apiId) {
          try {
            await tasksApi.delete(apiId);
          } catch (error) {
            console.error("Error deleting task:", error);
          }
        }
      },
    }),
    {
      name: "tasks",
    }
  )
);
