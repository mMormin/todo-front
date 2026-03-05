import axios, { AxiosError } from "axios";
import { Category, Task } from "../types";

// API response type adapters
type ApiCategoryResponse = {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
};
type ApiTaskResponse = {
  id: number;
  title: string;
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

// Response interceptor: categorizes errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      // Network error (no connection, timeout, CORS…)
      console.error("[Network Error]", error.message);
    } else {
      const { status } = error.response;
      if (status >= 500) {
        console.error(`[Server Error ${status}]`, error.response.data);
      } else if (status >= 400) {
        console.warn(`[Client Error ${status}]`, error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiCategoryResponse[]>("/categories/");
    return response.data.map((cat) => ({
      ...cat,
      id: cat.id.toString(),
    }));
  },

  /**
   * Create a new category
   * @param name - The category name
   * @param icon - The category icon (emoji)
   */
  create: async (name: string, icon: string): Promise<Category> => {
    const response = await apiClient.post<ApiCategoryResponse>("/categories/", {
      name,
      icon,
    });
    return {
      ...response.data,
      id: response.data.id.toString(),
    };
  },

  /**
   * Delete a category
   * @param id - The category ID
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}/`);
  },

  /**
   * Update a category
   * @param id - The category ID
   * @param updates - The fields to update
   */
  update: async (id: number, updates: { name: string }): Promise<Category> => {
    const response = await apiClient.patch<ApiCategoryResponse>(
      `/categories/${id}/`,
      updates
    );
    return {
      ...response.data,
      id: response.data.id.toString(),
    };
  },
};

export const tasksApi = {
  /**
   * Get all tasks
   * @param categoryId - Optional filter by category ID
   */
  getAll: async (categoryId?: number): Promise<Task[]> => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await apiClient.get<ApiTaskResponse[]>("/tasks/", {
      params,
    });
    return response.data.map((task) => ({
      id: task.id,
      text: task.title,
      categoryId: task.category.toString(),
      completed: task.is_completed,
      category_name: task.category_name,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }));
  },

  /**
   * Get a task by ID
   * @param id - The task ID
   */
  getById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<ApiTaskResponse>(`/tasks/${id}/`);
    const task = response.data;
    return {
      id: task.id,
      text: task.title,
      categoryId: task.category.toString(),
      completed: task.is_completed,
      category_name: task.category_name,
      created_at: task.created_at,
      updated_at: task.updated_at,
    };
  },

  /**
   * Create a new task
   * @param title - The task title
   * @param categoryId - The category ID
   * @param isCompleted - Completion status (optional)
   */
  create: async (
    title: string,
    categoryId: number,
    isCompleted: boolean = false
  ): Promise<Task> => {
    const response = await apiClient.post<ApiTaskResponse>("/tasks/", {
      title,
      category: categoryId,
      is_completed: isCompleted,
    });
    const task = response.data;
    return {
      id: task.id,
      text: task.title,
      categoryId: task.category.toString(),
      completed: task.is_completed,
      category_name: task.category_name,
      created_at: task.created_at,
      updated_at: task.updated_at,
    };
  },

  /**
   * Update a task
   * @param id - The task ID
   * @param updates - The fields to update
   */
  update: async (
    id: number,
    updates: { title?: string; is_completed?: boolean; category?: number }
  ): Promise<Task> => {
    const response = await apiClient.patch<ApiTaskResponse>(
      `/tasks/${id}/`,
      updates
    );
    const task = response.data;
    return {
      id: task.id,
      text: task.title,
      categoryId: task.category.toString(),
      completed: task.is_completed,
      category_name: task.category_name,
      created_at: task.created_at,
      updated_at: task.updated_at,
    };
  },

  /**
   * Delete a task
   * @param id - The task ID
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}/`);
  },
};
