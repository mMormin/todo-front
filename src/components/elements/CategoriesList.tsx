import React from "react";
import { Category } from "../../types";

interface CategoryProps {
  categories: Category[];
  onDeleteCategory?: (id: string) => void;
  onSelectCategory?: (id: string) => void;
}

const CategoriesList: React.FC<CategoryProps> = ({
  categories,
  onDeleteCategory,
  onSelectCategory,
}) => {
  return (
    <>
      {categories.map((category) => (
        <div
          key={category.id}
          className="group relative bg-amber-100 text-amber-800 px-2 py-1 text-xs rounded-full border border-amber-600 flex items-center cursor-pointer transition-all"
        >
          <span className="mr-1">{category.emoji}</span>

          {category.name && `#${category.name}`}

          {onDeleteCategory && (
            <button
              className="absolute top-0 right-0 bg-amber-800 text-white rounded-full border-2 size-full text-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => {
                onDeleteCategory?.(category.id);
              }}
            >
              ×
            </button>
          )}

          {onSelectCategory && (
            <button
              className="absolute top-0 right-0 bg-amber-800 text-white rounded-full border-2 size-full text-xs tracking-wider font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => onSelectCategory(category.id)}
            >
              SELECT
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default CategoriesList;
