import React, { useEffect } from "react";
import * as Sentry from "@sentry/react";
import Main from "./Main";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useCategoryStore } from "../store/useCategoryStore";
import { useTaskStore } from "../store/useTaskStore";

function SentryTestButton() {
  return (
    <button
      className="text-xs text-red-400 underline"
      onClick={() => {
        throw new Error("Sentry test error");
      }}
    >
      Test Sentry
    </button>
  );
}

function App() {
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const categoriesLoading = useCategoryStore((state) => state.isLoading);
  const tasksLoading = useTaskStore((state) => state.isLoading);
  const isLoading = categoriesLoading || tasksLoading;

  useEffect(() => {
    // Load categories and tasks on app start
    fetchCategories();
    fetchTasks();
  }, [fetchCategories, fetchTasks]);

  return (
    <div className="min-h-screen lg:mx-20 flex flex-col justify-center items-center bg-amber-50 lg:px-8 font-mono pt-15 pb-25">
      <div className="w-full max-w-[500px] flex flex-col justify-center items-center gap-4">
        <Header />
        <Main isLoading={isLoading} />
      </div>

      <Footer />
      <SentryTestButton />
    </div>
  );
}

export default App;
