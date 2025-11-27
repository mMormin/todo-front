import React, { useEffect } from "react";
import Main from "./Main";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useCategoryStore } from "../store/useCategoryStore";
import { useTaskStore } from "../store/useTaskStore";

function App() {
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    // Load categories and tasks on app start
    const loadData = async () => {
      try {
        await fetchCategories();
        await fetchTasks();
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    loadData();
  }, [fetchCategories, fetchTasks]);

  return (
    <div className="min-h-screen lg:mx-20 flex flex-col justify-center items-center bg-amber-50 lg:px-8 font-mono pt-15 pb-25">
      <div className="w-full max-w-[500px] flex flex-col justify-center items-center gap-4">
        <Header />
        <Main />
      </div>

      <Footer />
    </div>
  );
}

export default App;
