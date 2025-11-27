export interface Category {
  id: string;
  name: string;
  emoji: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: number;
  text: string;
  categoryId: string;
  completed: boolean;
  category_name?: string;
  created_at?: string;
  updated_at?: string;
}
