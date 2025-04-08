import React from "react";
import { Task, Category } from "../Main";

interface TasksListProps {
  tasks: Task[];
  toggleComplete: (id: number) => void;
  getCategoryForTask: (todo: Task) => Category;
}

const TasksList: React.FC<TasksListProps> = ({
  tasks,
  toggleComplete,
  getCategoryForTask,
}) => {
  return (
    <div className="space-y-1 mb-6">
      {tasks.length === 0 ? (
        <p className="text-center text-amber-700 italic">
          No tasks added for the moment. Add some!
        </p>
      ) : (
        tasks.map((todo) => {
          const category = getCategoryForTask(todo);
          return (
            <div
              key={todo.id}
              className="flex items-center p-3 bg-amber-50 border-2 border-amber-700 rounded"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="mr-3 h-5 w-5 accent-amber-700"
              />
              <span
                className={`flex-grow ${
                  todo.completed
                    ? "line-through text-amber-600"
                    : "text-amber-900"
                }`}
              >
                {todo.text}
              </span>
              <span className="bg-amber-200 text-amber-800 px-2 py-1 text-xs rounded-full flex items-center">
                <span className="mr-1">{category.emoji}</span>
                {category.name && `#${category.name}`}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TasksList;
