import React, { useState, useRef, useEffect } from "react";
import Categories from "./elements/CategoriesList";
import TasksList from "./elements/TasksList";
import EmojiPicker from "./elements/EmojiPicker";
import CategoryFilter from "./elements/CategoryFilter";
import ConfirmDeleteModal from "./elements/ConfirmDeleteModal";
import { handleKeyPress } from "../utils/keyboard";
import { getCategoryEmoji } from "../utils/category";
import { getTaskCountForCategory } from "../utils/taskHelpers";
import { Category, Task } from "../types";
import { useTaskStore } from "../store/useTaskStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { taskInputSchema } from "../validation/taskSchema";
import { AnimatePresence, motion } from "framer-motion";
import { ValidationError } from "yup";

const Main: React.FC = () => {
  // Tasks States
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const removeTasksByCategory = useTaskStore(
    (state) => state.removeTasksByCategory
  );
  const removeTaskById = useTaskStore((state) => state.removeTaskById);
  const getTasksByCategory = useTaskStore((state) => state.getTasksByCategory);

  // Categories States
  const categories = useCategoryStore((state) => state.categories);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);
  const getCategoryById = useCategoryStore((state) => state.getCategoryById);
  const getDefaultCategory = useCategoryStore(
    (state) => state.getDefaultCategory
  );

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
  const [taskErrorMessage, setTaskErrorMessage] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    name: string;
    emoji: string;
  } | null>(null);

  // Refs
  const categoriesMenuRef = useRef<HTMLDivElement>(null);

  const getCategoryForTask = (task: Task): Category => {
    return getCategoryById(task.categoryId) || getDefaultCategory();
  };

  const handleAddTask = async () => {
    try {
      await taskInputSchema.validate({ input });
      if (!selectedCategoryId) {
        setTaskErrorMessage("You forgot to select a category -->");
        setShowCategories(true);
        return;
      }
      const category = getCategoryById(selectedCategoryId);
      const apiCategoryId =
        typeof category?.id === "number" ? category.id : undefined;
      await addTask(
        input,
        selectedCategoryId || getDefaultCategory().id,
        apiCategoryId
      );
      setInput("");
      setTaskErrorMessage(null);
    } catch (err) {
      if (err instanceof ValidationError) {
        setTaskErrorMessage(err.message);
      }
    }
  };

  const handleDeleteTask = (taskId: number) => {
    removeTaskById(taskId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleAddCategory = async () => {
    const newCategory = await addCategory(categoryInput, selectedEmoji);
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

  const handleDeleteCategory = async (id: string) => {
    const category = getCategoryById(id);
    if (!category) return;

    const taskCount = getTaskCountForCategory(tasks, id);

    // If the category has associated tasks, show confirmation modal
    if (taskCount > 0) {
      setCategoryToDelete({
        id: category.id.toString(),
        name: category.name,
        emoji: category.emoji,
      });
    } else {
      // Otherwise, delete the category directly
      await deleteCategory(id);
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null);
      }
      if (filterCategoryId === id) {
        setFilterCategoryId(null);
      }
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    await deleteCategory(categoryToDelete.id);
    removeTasksByCategory(categoryToDelete.id);

    if (selectedCategoryId === categoryToDelete.id) {
      setSelectedCategoryId(null);
    }
    if (filterCategoryId === categoryToDelete.id) {
      setFilterCategoryId(null);
    }

    setCategoryToDelete(null);
  };

  const cancelDeleteCategory = () => {
    setCategoryToDelete(null);
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
      {/* CONFIRM DELETE CATEGORY MODAL */}
      <ConfirmDeleteModal
        isOpen={categoryToDelete !== null}
        categoryName={
          categoryToDelete
            ? `${categoryToDelete.emoji} ${categoryToDelete.name}`
            : ""
        }
        onConfirm={confirmDeleteCategory}
        onCancel={cancelDeleteCategory}
      />

      {/* CATEGORY FILTER */}
      <CategoryFilter
        categories={categories}
        filterCategoryId={filterCategoryId}
        setFilterCategoryId={setFilterCategoryId}
      />

      {/* ADD NEW TASK */}
      <div>
        <section className="flex flex-col">
          <label htmlFor="taskInput" className="text-amber-800 font-bold">
            T.A.S.K Creator
          </label>

          <div className="flex flex-wrap lg:flex-nowrap">
            <input
              id="taskInput"
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Write your new task here ..."
              className="flex-grow p-2 rounded-l bg-white border-2 border-amber-700 text-amber-900 focus:outline-none"
              onKeyUp={(e) => handleKeyPress(e, handleAddTask)}
            />

            <div className="relative flex flex-col lg:flex-row gap-2 w-full lg:w-auto mt-2 lg:mt-0">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="lg:w-[50px] max-w-full flex justify-center items-center text-xl lg:text-sm font-bold bg-amber-700 lg:-ml-1 group text-amber-50 px-4 h-10 lg:h-auto rounded lg:rounded-l-none border-amber-700 hover:border-amber-900 border-2 hover:bg-amber-900 transition cursor-pointer leading-none"
              >
                <span className="group-hover:scale-90 transition-transform duration-300 ease-in-out">
                  {getCategoryEmoji(
                    categories,
                    selectedCategoryId ||
                      (categories.length > 0 ? categories[0].id : null)
                  )}
                </span>
              </button>

              <div className="lg:w-[50px] h-10 lg:h-auto flex justify-center items-center ">
                <button
                  onClick={handleAddTask}
                  className="lg:hover:scale-87 w-full h-full tracking-wider transition-transform duration-300 ease-in-out font-medium text-2xl lg:text-4xl bg-amber-800 text-amber-50 px-4 lg:px-0 rounded hover:bg-amber-900 cursor-pointer leading-none"
                >
                  ↵
                </button>
              </div>

              {/* CATEGORY SELECTION SUBMENU */}
              {showCategories && (
                <motion.div
                  ref={categoriesMenuRef}
                  className="right-14 p-2 bg-amber-50 border-2 border-amber-800 rounded mb-2 flex flex-wrap gap-2 absolute"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-bold text-amber-800">
                    Categories:
                  </p>
                  <Categories
                    categories={categories}
                    onSelectCategory={handleSelectCategory}
                  />
                </motion.div>
              )}
            </div>
          </div>

          <div className="h-5">
            <AnimatePresence>
              {taskErrorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.1 }}
                  className="text-red-500 text-xs font-bold tracking-wider italic"
                >
                  {taskErrorMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* TASKS LIST */}
        <TasksList
          tasks={
            filterCategoryId ? getTasksByCategory(filterCategoryId) : tasks
          }
          toggleComplete={toggleComplete}
          getCategoryForTask={getCategoryForTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {/* SEPARATOR */}
      <section className="w-full flex justify-center items-center text-center h-5 text-3xl font-bold leading-3 tracking-wider text-amber-700">
        <span className="pb-3">...</span>
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
