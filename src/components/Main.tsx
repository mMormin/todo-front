import React, { useState } from "react";
import Categories from "./elements/CategoriesList";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import TasksList from "./elements/TasksList";
import EmojiPicker from "./elements/EmojiPicker";
import { useRef } from "react";
import { useEffect } from "react";

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

const Main: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [showCategories, setShowCategories] = useState(false);
  const [showEmojiPickerForCategory, setShowEmojiPickerForCategory] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("😃");

  const categoriesMenuRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Hooman", emoji: "👤" },
    { id: "2", name: "Work", emoji: "💼" },
    { id: "3", name: "Food", emoji: "🛒" },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCategoryInput(e.target.value);
  };

  const handleAddTask = () => {
    if (!input.trim()) return;

    const match = input.match(/^(.+?)(?:\s+#([^\s]+))?$/);

    if (match) {
      const todoText = match[1].trim();
      const categoryName = match[2]?.trim();

      let categoryObj = categoryName
        ? categories.find((cat) => cat.name === categoryName)
        : categories[0];

      if (categoryName && !categoryObj) {
        const newCategory: Category = {
          id: Date.now().toString(),
          name: categoryName,
          emoji: "😃",
        };
        setCategories([...categories, newCategory]);
        categoryObj = newCategory;
      }

      const newTask: Task = {
        id: Date.now(),
        text: todoText,
        categoryId:
          selectedCategoryId ||
          (categoryObj ? categoryObj.id : categories[0].id),
        completed: false,
      };

      setTasks([...tasks, newTask]);
      setInput("");
    }
  };

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryInput.trim() || `Default Task ${categories.length + 1}`,
      emoji: selectedEmoji,
    };

    setCategories([...categories, newCategory]);
    setCategoryInput("");
    setSelectedEmoji("😃");
    setShowCategoryInput(false);
    setShowEmojiPicker(false);
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const getCategoryForTask = (todo: Task): Category => {
    return (
      categories.find((cat) => cat.id === todo.categoryId) || categories[0]
    );
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const handleSelectCategory = (id: string) => {
    setSelectedCategoryId(id);
    setShowCategories(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setTasks((prev) => prev.filter((task) => task.categoryId !== id));
  };

  useEffect(() => {
    if (!showCategories) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesMenuRef.current &&
        !categoriesMenuRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategories]);

  return (
    <div className="w-full bg-amber-100 p-6 rounded-lg shadow-lg border-4 border-amber-900">
      <div className="mb-6 flex">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Add a new task..."
          className="flex-grow p-2 rounded-l bg-amber-50 border-2 border-amber-800 text-amber-900 focus:outline-none"
          onKeyUp={(e) => handleKeyPress(e, handleAddTask)}
        />

        <div className="relative flex gap-2">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-[50px] flex justify-center items-center text-2xl font-bold bg-amber-800 text-amber-50 px-4 rounded-r hover:text-3xl hover:bg-amber-900 transition cursor-pointer leading-none"
          >
            {selectedCategoryId
              ? categories.find((cat) => cat.id === selectedCategoryId)
                  ?.emoji || ":)"
              : ":)"}
          </button>

          <button
            onClick={handleAddTask}
            className="w-[50px] flex justify-center items-center text-3xl font-bold bg-amber-800 text-amber-50 px-4 rounded hover:text-4xl hover:bg-amber-900 transition cursor-pointer leading-none"
          >
            +
          </button>

          {showCategories && (
            <div
              ref={categoriesMenuRef}
              className="-left-1 p-2 bg-amber-50 border-2 border-amber-800 rounded mb-2 flex flex-wrap gap-2 absolute"
            >
              <p className="text-xs font-bold text-amber-800">Categories:</p>

              <Categories
                categories={categories}
                onSelectCategory={handleSelectCategory}
              />
            </div>
          )}
        </div>
      </div>

      <TasksList
        tasks={tasks}
        toggleComplete={toggleComplete}
        getCategoryForTask={getCategoryForTask}
      />

      <div className="mt-6 bg-amber-200 p-3 rounded border-2 border-amber-700">
        <div className="flex justify-between items-center mb-2">
          <p className="text-amber-800 text-sm font-bold">
            Available Categories:
          </p>

          <button
            onClick={() => {
              setShowCategoryInput(!showCategoryInput);
              if (!showCategoryInput) {
                setShowEmojiPicker(false);
              }
            }}
            className="bg-amber-700 text-amber-50 px-2 py-1 text-xs font-bold tracking-wide rounded hover:bg-amber-800 cursor-pointer"
          >
            {showCategoryInput ? "< Back" : "+ Add a category"}
          </button>
        </div>

        {showCategoryInput && (
          <div className="mb-3">
            <div className="flex mb-2 relative">
              <button
                onClick={() =>
                  setShowEmojiPickerForCategory(!showEmojiPickerForCategory)
                }
                className="p-2 rounded bg-amber-50 border-2 border-amber-800 text-2xl mr-2 cursor-pointer"
              >
                {selectedEmoji}
              </button>

              {showEmojiPickerForCategory && (
                <EmojiPicker
                  onSelect={(emoji) => {
                    setSelectedEmoji(emoji);
                    setShowEmojiPickerForCategory(false);
                  }}
                  onClose={() => setShowEmojiPickerForCategory(false)}
                  className="top-full left-0 mt-2"
                />
              )}

              <input
                type="text"
                value={categoryInput}
                onChange={handleCategoryInputChange}
                placeholder="Category Name"
                className="flex-grow p-2 rounded bg-amber-50 border-2 border-amber-800 text-amber-900 focus:outline-none text-sm"
              />
            </div>

            <button
              onClick={handleAddCategory}
              className="w-full bg-amber-800 text-amber-50 font-bold px-3 py-1 rounded hover:bg-amber-900 text-sm cursor-pointer"
            >
              + Add The New Category
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Categories
            categories={categories}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
