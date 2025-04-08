import { useState } from "react";
import { parseTaskText } from "../utils/task";
import { Task } from "../types";

export const useTasks = (initialTasks: Task[] = []) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (text: string, categoryId: string): void => {
    if (!text.trim()) return;

    const { text: taskText } = parseTaskText(text);

    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      categoryId,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleComplete = (id: number): void => {
    setTasks((prevTasks) =>
      prevTasks.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTasksByCategory = (categoryId: string): void => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.categoryId !== categoryId)
    );
  };

  const getTasksByCategory = (categoryId: string | null): Task[] => {
    return categoryId
      ? tasks.filter((task) => task.categoryId === categoryId)
      : tasks;
  };

  const updateTask = (id: number, updates: Partial<Omit<Task, "id">>): void => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: number): void => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return {
    tasks,
    addTask,
    toggleComplete,
    removeTasksByCategory,
    getTasksByCategory,
    updateTask,
    deleteTask,
    setTasks,
  };
};
