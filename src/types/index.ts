export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface Task {
  id: number;
  text: string;
  categoryId: string;
  completed: boolean;
}
