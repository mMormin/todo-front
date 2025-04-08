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
    <div
      className={`w-full space-y-2 bg-white border-2 border-amber-700 rounded min-h-50 flex flex-col items-center ${
        tasks.length !== 0 ? "justify-start py-2" : "justify-center"
      }`}
    >
      {tasks.length === 0 ? (
        <p className="text-center text-amber-700 italic">
          No tasks added for the moment. Add some!
        </p>
      ) : (
        <div className="w-[95%] space-y-2">
          {tasks.map((todo) => {
            const category = getCategoryForTask(todo);
            return (
              <div
                key={todo.id}
                className="flex items-center p-3 bg-amber-50 border-2 border-amber-700 rounded w-full"
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
          })}
        </div>
      )}
    </div>
  );
};

export default TasksList;
