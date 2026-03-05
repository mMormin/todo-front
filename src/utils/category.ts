import { Category } from "../types";

/**
 * Find a category by its ID
 * @param categories List of categories to search in
 * @param id ID of the category to find
 * @returns The found category or undefined
 */
export const findCategoryById = (
  categories: Category[],
  id: string | null
): Category | undefined => {
  if (!id) return undefined;
  return categories.find((cat) => cat.id === id);
};

/**
 * Get icon for a given category ID
 * @param categories List of categories
 * @param id ID of the category
 * @param defaultIcon Fallback icon if category not found
 * @returns Icon of the category or default icon
 */
export const getCategoryIcon = (
  categories: Category[],
  id: string | null,
  defaultIcon: string = "😃"
): string => {
  const category = findCategoryById(categories, id);
  return category?.icon || defaultIcon;
};

/**
 * Get the first category as default
 * @param categories Array of categories
 * @returns The first category or a default one if the array is empty
 */
export const getDefaultCategory = (categories: Category[]): Category => {
  if (categories.length === 0) {
    return { id: "default", name: "Default", icon: "📝" };
  }
  return categories[0];
};
