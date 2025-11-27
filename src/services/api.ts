import axios from "axios";
import { Category, Task } from "../types";

// API response type adapters
type ApiCategoryResponse = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};
type ApiTaskResponse = {
  id: number;
  description: string;
  is_completed: boolean;
  category: number;
  category_name: string;
  created_at: string;
  updated_at: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Axios Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiCategoryResponse[]>(
        "/categories/"
      );
      return response.data.map((cat) => ({
        ...cat,
        id: cat.id.toString(),
        emoji: "📁", // Default emoji
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  /**
   * Create a new category
   * @param name - The category name
   */
  create: async (name: string): Promise<Category> => {
    try {
      const response = await apiClient.post<ApiCategoryResponse>(
        "/categories/",
        {
          name,
        }
      );
      return {
        ...response.data,
        id: response.data.id.toString(),
        emoji: "📁",
      };
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  /**
   * Delete a category
   * @param id - The category ID
   */
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/categories/${id}/`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update a category
   * @param id - The category ID
   * @param updates - The fields to update
   */
  update: async (id: number, updates: { name?: string }): Promise<Category> => {
    try {
      const response = await apiClient.patch<ApiCategoryResponse>(
        `/categories/${id}/`,
        updates
      );
      return {
        ...response.data,
        id: response.data.id.toString(),
        emoji: "📁",
      };
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },
};

export const tasksApi = {
  /**
   * Get all tasks
   * @param categoryId - Optional filter by category ID
   */
  getAll: async (categoryId?: number): Promise<Task[]> => {
    try {
      const params = categoryId ? { category_id: categoryId } : {};
      const response = await apiClient.get<ApiTaskResponse[]>("/tasks/", {
        params,
      });
      return response.data.map((task) => ({
        id: task.id,
        text: task.description,
        categoryId: task.category.toString(),
        completed: task.is_completed,
        category_name: task.category_name,
        created_at: task.created_at,
        updated_at: task.updated_at,
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  /**
   * Get a task by ID
   * @param id - The task ID
   */
  getById: async (id: number): Promise<Task> => {
    try {
      const response = await apiClient.get<ApiTaskResponse>(`/tasks/${id}/`);
      const task = response.data;
      return {
        id: task.id,
        text: task.description,
        categoryId: task.category.toString(),
        completed: task.is_completed,
        category_name: task.category_name,
        created_at: task.created_at,
        updated_at: task.updated_at,
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new task
   * @param description - The task description
   * @param categoryId - The category ID
   * @param isCompleted - Completion status (optional)
   */
  create: async (
    description: string,
    categoryId: number,
    isCompleted: boolean = false
  ): Promise<Task> => {
    try {
      const response = await apiClient.post<ApiTaskResponse>("/tasks/", {
        description,
        category: categoryId,
        is_completed: isCompleted,
      });
      const task = response.data;
      return {
        id: task.id,
        text: task.description,
        categoryId: task.category.toString(),
        completed: task.is_completed,
        category_name: task.category_name,
        created_at: task.created_at,
        updated_at: task.updated_at,
      };
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  /**
   * Update a task
   * @param id - The task ID
   * @param updates - The fields to update
   */
  update: async (
    id: number,
    updates: { description?: string; is_completed?: boolean; category?: number }
  ): Promise<Task> => {
    try {
      const response = await apiClient.patch<ApiTaskResponse>(
        `/tasks/${id}/`,
        updates
      );
      const task = response.data;
      return {
        id: task.id,
        text: task.description,
        categoryId: task.category.toString(),
        completed: task.is_completed,
        category_name: task.category_name,
        created_at: task.created_at,
        updated_at: task.updated_at,
      };
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a task
   * @param id - The task ID
   */
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/tasks/${id}/`);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },
};

export default apiClient;
