import React from "react";

interface CategoryProps {
  categories: {
    id: string;
    name: string;
    emoji: string;
  }[];
}

const Categories: React.FC<CategoryProps> = ({ categories }) => {
  return (
    <>
      {categories.map((category) => (
        <span
          key={category.id}
          className="bg-amber-100 text-amber-800 px-2 py-1 text-xs rounded-full border border-amber-600 font-mono flex items-center"
        >
          <span className="mr-1">{category.emoji}</span>
          {category.name && `#${category.name}`}
        </span>
      ))}
    </>
  );
};
export default Categories;
