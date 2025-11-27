// store/useCategoryStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Category } from "../types";
import {
  findCategoryById,
  getDefaultCategory as getFirstCategory,
  extractEmojiFromName,
} from "../utils/category";
import { categoriesApi } from "../services/api";

type CategoryState = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string, emoji: string) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string | null) => Category | undefined;
  updateCategory: (
    id: string,
    updates: Partial<Omit<Category, "id">>
  ) => Promise<void>;
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
      isLoading: false,
      error: null,

      fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
          const categories = await categoriesApi.getAll();
          set({ categories, isLoading: false });
        } catch (error) {
          console.error("Error loading categories:", error);
          set({
            error: "Unable to load categories",
            isLoading: false,
          });
        }
      },

      setCategories: (categories) => set({ categories }),

      addCategory: async (name, emoji) => {
        const cleanName = name.trim();

        try {
          const newCategory = await categoriesApi.create(cleanName);
          // Add emoji to the category (frontend-specific field)
          newCategory.emoji = emoji;

          set((state) => ({
            categories: [...state.categories, newCategory],
          }));

          return newCategory;
        } catch (error) {
          console.error("Error creating category:", error);

          // Fallback to local mode if API fails
          const newCategory: Category = {
            id: Date.now().toString(),
            name:
              name.trim() || `Default Category ${get().categories.length + 1}`,
            emoji: emoji || "😃",
          };
          set((state) => ({
            categories: [...state.categories, newCategory],
          }));

          return newCategory;
        }
      },

      deleteCategory: async (id) => {
        const category = get().categories.find((cat) => cat.id === id);

        // Immediate local deletion
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));

        // Sync with API
        if (category?.id) {
          try {
            const numericId = parseInt(category.id);
            if (!isNaN(numericId)) {
              await categoriesApi.delete(numericId);
            }
          } catch (error) {
            console.error("Error deleting category:", error);
            // Rollback on error
            set((state) => ({
              categories: [...state.categories, category],
            }));
          }
        }
      },

      getCategoryById: (id) => {
        return findCategoryById(get().categories, id);
      },

      updateCategory: async (id, updates) => {
        const category = get().categories.find((cat) => cat.id === id);

        // Immediate local update
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        }));

        // Sync with API
        if (category?.id && updates.name) {
          try {
            const numericId = parseInt(category.id);
            if (!isNaN(numericId)) {
              await categoriesApi.update(numericId, { name: updates.name });
            }
          } catch (error) {
            console.error("Error updating category:", error);
          }
        }
      },

      getDefaultCategory: () => {
        return getFirstCategory(get().categories);
      },
    }),
    {
      name: "categories",
    }
  )
);
