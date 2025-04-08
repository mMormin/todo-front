import { Task } from "../types";

/**
 * Parse task text for hashtags and return cleaned text
 * @param text Raw task text that might include hashtags
 * @returns Cleaned task text without hashtags
 */
export const parseTaskText = (
  text: string
): { text: string; hashtag: string | null } => {
  const match = text.match(/^(.+?)(?:\s+#([^\s]+))?$/);

  if (match) {
    return {
      text: match[1].trim(),
      hashtag: match[2] ? match[2].trim() : null,
    };
  }

  return { text, hashtag: null };
};

/**
 * Group tasks by their category
 * @param tasks List of tasks to group
 * @returns Object with category IDs as keys and arrays of tasks as values
 */
export const groupTasksByCategory = (tasks: Task[]): Record<string, Task[]> => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.categoryId]) {
      acc[task.categoryId] = [];
    }
    acc[task.categoryId].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
};
