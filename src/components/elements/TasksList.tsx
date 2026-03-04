import { Category, Task } from "../../types";

interface TasksListProps {
  tasks: Task[];
  toggleComplete: (id: number, apiId?: number) => void;
  getCategoryForTask: (task: Task) => Category;
  onDeleteTask: (id: number) => void;
}

const TasksList: React.FC<TasksListProps> = ({
  tasks,
  toggleComplete,
  getCategoryForTask,
  onDeleteTask,
}) => {
  return (
    <section>
      <h2 className="text-amber-800 font-bold">Todo List</h2>

      <div
        className={`w-full space-y-2 bg-amber-50 border-2 border-amber-700 rounded min-h-50 flex flex-col items-center ${
          tasks.length !== 0 ? "justify-start py-2" : "justify-center"
        }`}
      >
        {tasks.length === 0 ? (
          <p className="text-center text-amber-700 italic">
            No tasks added for the moment. Add some!
          </p>
        ) : (
          <div className="w-[95%] space-y-2">
            {tasks.map((task) => {
              const category = getCategoryForTask(task);
              return (
                <div
                  key={task.id}
                  className="flex items-center p-3 bg-amber-50 border-2 border-amber-700 rounded w-full"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id, task.id)}
                    className="mr-3 h-5 w-5 accent-amber-700"
                  />
                  <p
                    className={`flex-grow ${
                      task.completed
                        ? "line-through text-amber-600"
                        : "text-amber-900"
                    }`}
                  >
                    {task.text}
                  </p>
                  <span className="bg-amber-200 text-amber-800 px-2 py-1 text-xs rounded-full flex items-center">
                    <span className="mr-1">{category.emoji}</span>
                    {category.name && `#${category.name}`}
                  </span>

                  <div className=" size-8 flex justify-end items-end">
                    <button
                      className="size-full text-2xl text-red-700 cursor-pointer font-bold hover:text-black transition"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      x
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TasksList;
