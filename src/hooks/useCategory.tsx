import { useState } from "react";
import {
  findCategoryById,
  getDefaultCategory as getFirstCategory,
} from "../utils/category";
import { Category } from "../types";

export const useCategories = (initialCategories: Category[] = []) => {
  const [categories, setCategories] = useState<Category[]>(
    initialCategories.length > 0
      ? initialCategories
      : [
          { id: "1", name: "Hooman", emoji: "👤" },
          { id: "2", name: "Work", emoji: "💼" },
          { id: "3", name: "Food", emoji: "🛒" },
        ]
  );

  const addCategory = (name: string, emoji: string): Category => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: name.trim() || `Default Category ${categories.length + 1}`,
      emoji: emoji || "😃",
    };

    setCategories((prevCategories) => [...prevCategories, newCategory]);
    return newCategory;
  };

  const deleteCategory = (id: string): void => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.id !== id)
    );
  };

  const getCategoryById = (id: string | null): Category | undefined => {
    return findCategoryById(categories, id);
  };

  const updateCategory = (
    id: string,
    updates: Partial<Omit<Category, "id">>
  ): void => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      )
    );
  };

  const getDefaultCategory = (): Category => {
    return getFirstCategory(categories);
  };

  return {
    categories,
    addCategory,
    deleteCategory,
    getCategoryById,
    updateCategory,
    getDefaultCategory,
    setCategories,
  };
};
