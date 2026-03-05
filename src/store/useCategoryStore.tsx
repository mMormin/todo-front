import { create } from "zustand";
import { Category } from "../types";
import {
  findCategoryById,
  getDefaultCategory as getFirstCategory,
} from "../utils/category";
import { categoriesApi } from "../services/api";

type CategoryState = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string, icon: string) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string | null) => Category | undefined;
  updateCategory: (id: string, updates: Partial<Omit<Category, "id">>) => Promise<void>;
  getDefaultCategory: () => Category;
  setCategories: (categories: Category[]) => void;
};

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoriesApi.getAll();
      set({ categories, isLoading: false });
    } catch (error) {
      console.error("Error loading categories:", error);
      set({ error: "Unable to load categories", isLoading: false });
    }
  },

  setCategories: (categories) => set({ categories }),

  addCategory: async (name, icon) => {
    try {
      const newCategory = await categoriesApi.create(name.trim(), icon);
      newCategory.icon = icon;
      set((state) => ({ categories: [...state.categories, newCategory] }));
      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    const category = get().categories.find((cat) => cat.id === id);
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    }));
    if (category) {
      try {
        await categoriesApi.delete(parseInt(category.id));
      } catch (error) {
        console.error("Error deleting category:", error);
        set((state) => ({ categories: [...state.categories, category] }));
      }
    }
  },

  getCategoryById: (id) => findCategoryById(get().categories, id),

  updateCategory: async (id, updates) => {
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    }));
    if (updates.name) {
      try {
        await categoriesApi.update(parseInt(id), { name: updates.name });
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  },

  getDefaultCategory: () => getFirstCategory(get().categories),
}));
