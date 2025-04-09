// store/useCategoryStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Category } from "../types";
import {
  findCategoryById,
  getDefaultCategory as getFirstCategory,
} from "../utils/category";

type CategoryState = {
  categories: Category[];
  addCategory: (name: string, emoji: string) => Category;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string | null) => Category | undefined;
  updateCategory: (id: string, updates: Partial<Omit<Category, "id">>) => void;
  getDefaultCategory: () => Category;
  setCategories: (categories: Category[]) => void;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [
        { id: "1", name: "Hooman", emoji: "👤" },
        { id: "2", name: "Work", emoji: "💼" },
        { id: "3", name: "Food", emoji: "🛒" },
      ],

      setCategories: (categories) => set({ categories }),

      addCategory: (name, emoji) => {
        const { categories } = get();
        const newCategory: Category = {
          id: Date.now().toString(),
          name: name.trim() || `Default Category ${categories.length + 1}`,
          emoji: emoji || "😃",
        };
        set({ categories: [...categories, newCategory] });
        return newCategory;
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
      },

      getCategoryById: (id) => {
        return findCategoryById(get().categories, id);
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        }));
      },

      getDefaultCategory: () => {
        return getFirstCategory(get().categories);
      },
    }),
    {
      name: "category-store",
    }
  )
);
