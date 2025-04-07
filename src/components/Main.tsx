import React, { useState } from "react";
import Categories from "./elements/Categories";

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface Todo {
  id: number;
  text: string;
  categoryId: string;
  completed: boolean;
}

const Main: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [showCategoriesMenu, setShowCategoriesMenu] = useState<boolean>(false);
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("📝");

  // Collection d'emojis pour le sélecteur
  const emojis: string[] = [
    "📝",
    "💼",
    "🏠",
    "🛒",
    "🎮",
    "🎵",
    "🏋️",
    "📚",
    "✈️",
    "🎬",
    "👨‍👩‍👧‍👦",
    "🐶",
    "🌱",
    "🍕",
    "🎨",
    "💻",
    "📱",
    "🚗",
    "💰",
    "⏰",
    "🎁",
    "📞",
    "🎯",
    "🎓",
    "🌍",
    "❤️",
    "🔧",
    "🏆",
    "🧩",
    "🔍",
  ];

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Personnel", emoji: "👤" },
    { id: "2", name: "Travail", emoji: "💼" },
    { id: "3", name: "Courses", emoji: "🛒" },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCategoryInput(e.target.value);
  };

  const handleAddTodo = () => {
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
          emoji: "📝",
        };
        setCategories([...categories, newCategory]);
        categoryObj = newCategory;
      }

      const newTodo: Todo = {
        id: Date.now(),
        text: todoText,
        categoryId: categoryObj ? categoryObj.id : categories[0].id,
        completed: false,
      };

      setTodos([...todos, newTodo]);
      setInput("");
    }
  };

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryInput.trim() || `Catégorie ${categories.length + 1}`, // Nom optionnel
      emoji: selectedEmoji,
    };

    setCategories([...categories, newCategory]);
    setCategoryInput("");
    setSelectedEmoji("📝");
    setShowCategoryInput(false);
    setShowEmojiPicker(false);
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const getCategoryForTodo = (todo: Todo): Category => {
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

  const handleOpenCategories = () => {
    setShowCategoriesMenu(!showCategoriesMenu);
  };

  return (
    <div className="w-full bg-amber-100 p-6 rounded-lg shadow-lg border-4 border-amber-900">
      <div className="mb-6 flex">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Add a new task..."
          className="flex-grow p-2 rounded-l bg-amber-50 border-2 border-amber-800 text-amber-900 focus:outline-none font-mono"
          onKeyUp={(e) => handleKeyPress(e, handleAddTodo)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleOpenCategories}
            className="w-[50px] flex justify-center items-center text-2xl font-bold bg-amber-800 text-amber-50 px-4 rounded-r hover:text-3xl hover:bg-amber-900 transition font-mono cursor-pointer leading-none"
          >
            :)
          </button>
          <button
            onClick={handleAddTodo}
            className="w-[50px] flex justify-center items-center text-3xl font-bold bg-amber-800 text-amber-50 px-4 rounded hover:text-4xl hover:bg-amber-900 transition font-mono cursor-pointer leading-none"
          >
            +
          </button>

          {showCategoriesMenu && (
            <div className="absolute w-27 h-32 bg-amber-100 p-4 rounded border-2 border-amber-800">
              <Categories categories={categories} />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1 mb-6">
        {todos.length === 0 ? (
          <p className="text-center text-amber-700 italic font-mono">
            No tasks added for the moment. Add some!
          </p>
        ) : (
          todos.map((todo) => {
            const category = getCategoryForTodo(todo);
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
                  className={`flex-grow font-mono ${
                    todo.completed
                      ? "line-through text-amber-600"
                      : "text-amber-900"
                  }`}
                >
                  {todo.text}
                </span>
                <span className="bg-amber-200 text-amber-800 px-2 py-1 text-xs rounded-full font-mono flex items-center">
                  <span className="mr-1">{category.emoji}</span>
                  {category.name && `#${category.name}`}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 bg-amber-200 p-3 rounded border-2 border-amber-700">
        <div className="flex justify-between items-center mb-2">
          <p className="text-amber-800 font-mono text-sm">
            Available Categories:
          </p>
          <button
            onClick={() => {
              setShowCategoryInput(!showCategoryInput);
              if (!showCategoryInput) {
                setShowEmojiPicker(false);
              }
            }}
            className="bg-amber-700 text-amber-50 px-2 py-1 text-xs font-bold tracking-wide rounded hover:bg-amber-800 font-mono cursor-pointer"
          >
            {showCategoryInput ? "< Back" : "+ Add a category"}
          </button>
        </div>

        {showCategoryInput && (
          <div className="mb-3">
            <div className="flex mb-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 rounded bg-amber-50 border-2 border-amber-800 text-2xl mr-2"
              >
                {selectedEmoji}
              </button>
              <input
                type="text"
                value={categoryInput}
                onChange={handleCategoryInputChange}
                placeholder="Nom de catégorie (optionnel)"
                className="flex-grow p-2 rounded bg-amber-50 border-2 border-amber-800 text-amber-900 focus:outline-none font-mono text-sm"
              />
            </div>

            {showEmojiPicker && (
              <div className="p-2 bg-amber-50 border-2 border-amber-800 rounded mb-2 flex flex-wrap">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setSelectedEmoji(emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1 text-xl hover:bg-amber-200 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleAddCategory}
              className="w-full bg-amber-800 text-amber-50 font-bold px-3 py-1 rounded hover:bg-amber-900 font-mono text-sm"
            >
              + Add The New Category
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Categories categories={categories} />
        </div>
      </div>
    </div>
  );
};

export default Main;
