import React from "react";
import { Category } from "../../types";

interface CategoryFilterProps {
  categories: Category[];
  filterCategoryId: string | null;
  setFilterCategoryId: (id: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  filterCategoryId,
  setFilterCategoryId,
}) => {
  return (
    <section className="bg-amber-200 p-3 rounded border-2 border-amber-700 flex justify-center items-center gap-2">
      <label className="flex text-amber-800 font-bold text-sm leading-4">
        Filter Tasks by Category
      </label>

      <select
        value={filterCategoryId || ""}
        onChange={(e) => setFilterCategoryId(e.target.value || null)}
        className="w-full p-2 rounded bg-amber-50 border-2 border-amber-800 text-amber-900 focus:outline-none cursor-pointer"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.emoji} {cat.name}
          </option>
        ))}
      </select>
    </section>
  );
};

export default CategoryFilter;
