import { Task } from "../types";

/**
 * Get the count of tasks for a specific category
 */
export const getTaskCountForCategory = (
  tasks: Task[],
  categoryId: string
): number => {
  return tasks.filter((task) => task.categoryId === categoryId).length;
};
