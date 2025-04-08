import React, { useState, useRef, useEffect } from "react";
import Categories from "./elements/CategoriesList";
import TasksList from "./elements/TasksList";
import EmojiPicker from "./elements/EmojiPicker";
import CategoryFilter from "./elements/CategoryFilter";
import { useTasks } from "../hooks/useTask";
import { useCategories } from "../hooks/useCategory";
import { handleKeyPress } from "../utils/keyboard";
import { getCategoryEmoji } from "../utils/category";
import { Category, Task } from "../types";

const Main: React.FC = () => {
  // Tasks and Categories Hooks
  const {
    tasks,
    addTask,
    toggleComplete,
    removeTasksByCategory,
    getTasksByCategory,
  } = useTasks();

  const {
    categories,
    addCategory,
    deleteCategory,
    getCategoryById,
    getDefaultCategory,
  } = useCategories();

  // Main States
  const [input, setInput] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("😃");
  const [showEmojiPickerForCategory, setShowEmojiPickerForCategory] =
    useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);

  // Refs
  const categoriesMenuRef = useRef<HTMLDivElement>(null);

  const getCategoryForTask = (task: Task): Category => {
    return getCategoryById(task.categoryId) || getDefaultCategory();
  };

  const handleAddTask = () => {
    if (input.trim()) {
      addTask(input, selectedCategoryId || getDefaultCategory().id);
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleAddCategory = () => {
    const newCategory = addCategory(categoryInput, selectedEmoji);
    resetCategoryForm();
    return newCategory;
  };

  const resetCategoryForm = () => {
    setCategoryInput("");
    setSelectedEmoji("😃");
    setShowCategoryInput(false);
    setShowEmojiPickerForCategory(false);
  };

  const handleSelectCategory = (id: string) => {
    setSelectedCategoryId(id);
    setShowCategories(false);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    removeTasksByCategory(id);

    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
    }
    if (filterCategoryId === id) {
      setFilterCategoryId(null);
    }
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCategoryInput(e.target.value);
  };

  const toggleCategoryInput = () => {
    setShowCategoryInput(!showCategoryInput);
    if (!showCategoryInput) {
      setShowEmojiPickerForCategory(false);
    }
  };

  // Click outside div UseEffect
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCategories]);

  return (
    <main className="w-full flex flex-col gap-4 bg-amber-100 p-6 rounded-lg shadow-lg border-4 border-amber-800">
      {/* CATEGORY FILTER */}
      <CategoryFilter
        categories={categories}
        filterCategoryId={filterCategoryId}
        setFilterCategoryId={setFilterCategoryId}
      />

      {/* ADD NEW TASK */}
      <section className="flex flex-wrap lg:flex-nowrap">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Write your new task here ..."
          className="flex-grow p-2 rounded-l bg-amber-50 border-2 border-amber-700 text-amber-900 focus:outline-none"
          onKeyUp={(e) => handleKeyPress(e, handleAddTask)}
        />

        <div className="relative flex flex-col lg:flex-row gap-2 w-full lg:w-auto mt-2 lg:mt-0">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="lg:w-[50px] max-w-full flex justify-center items-center lg:text-2xl font-bold bg-amber-800 text-amber-50 px-4 h-10 lg:h-auto rounded mg:rounded-r hover:bg-amber-900 transition cursor-pointer leading-none"
          >
            {getCategoryEmoji(categories, selectedCategoryId)}
          </button>

          <button
            onClick={handleAddTask}
            className="lg:w-[50px]  max-w-full flex justify-center items-center lg:text-3xl font-bold bg-amber-800 text-amber-50 px-4 h-10 lg:h-auto rounded hover:text-4xl hover:bg-amber-900 transition cursor-pointer leading-none"
          >
            +
          </button>

          {/* CATEGORY SELECTION SUBMENU */}
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
      </section>

      {/* TASKS LIST */}
      <TasksList
        tasks={filterCategoryId ? getTasksByCategory(filterCategoryId) : tasks}
        toggleComplete={toggleComplete}
        getCategoryForTask={getCategoryForTask}
      />

      {/* SEPARATOR */}
      <section className="w-full flex justify-center items-center text-center h-5 text-3xl font-bold leading-3 tracking-wider text-amber-700">
        <p className="pb-3">...</p>
      </section>

      {/* CATEGORIES LIST */}
      <section className="bg-amber-200 p-3 rounded border-2 border-amber-700">
        <div className="flex justify-between items-center mb-2">
          <p className="text-amber-800 text-sm font-bold">
            Available Categories:
          </p>

          <button
            onClick={toggleCategoryInput}
            className="bg-amber-700 text-amber-50 px-2 py-1 text-xs font-bold tracking-wide rounded hover:bg-amber-800 cursor-pointer"
          >
            {showCategoryInput ? "< Back" : "+ Add a category"}
          </button>
        </div>

        {/* ADD NEW CATEGORY */}
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
                />
              )}

              <input
                type="text"
                value={categoryInput}
                onChange={handleCategoryInputChange}
                placeholder="Category Name"
                className="flex-grow p-2 rounded bg-amber-50 border-2 border-amber-800 text-amber-900 focus:outline-none text-sm"
                onKeyUp={(e) => handleKeyPress(e, handleAddCategory)}
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

        {/* CATEGORIES LIST */}
        <div className="flex flex-wrap gap-2">
          <Categories
            categories={categories}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>
      </section>
    </main>
  );
};

export default Main;
