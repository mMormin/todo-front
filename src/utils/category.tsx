import { Category } from "../types";

/**
 * Extract emoji from name if present
 * @param name The name string that may contain an emoji
 * @returns An object with the extracted emoji and clean name
 */
export const extractEmojiFromName = (
  name: string
): { emoji: string; cleanName: string } => {
  const emojiRegex = /^([\p{Emoji}\u200d]+)\s*/u;
  const match = name.match(emojiRegex);

  if (match) {
    return {
      emoji: match[1].trim(),
      cleanName: name.slice(match[0].length).trim(),
    };
  }

  return { emoji: "📁", cleanName: name };
};

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
 * Get emoji for a given category ID
 * @param categories List of categories
 * @param id ID of the category
 * @param defaultEmoji Fallback emoji if category not found
 * @returns Emoji of the category or default emoji
 */
export const getCategoryEmoji = (
  categories: Category[],
  id: string | null,
  defaultEmoji: string = "😃"
): string => {
  const category = findCategoryById(categories, id);
  return category?.emoji || defaultEmoji;
};

/**
 * Get the first category as default
 * @param categories Array of categories
 * @returns The first category or a default one if the array is empty
 */
export const getDefaultCategory = (categories: Category[]): Category => {
  if (categories.length === 0) {
    return { id: "default", name: "Default", emoji: "📝" };
  }
  return categories[0];
};
