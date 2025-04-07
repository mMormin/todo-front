import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-center items-center bg-amber-100 rounded-lg shadow-lg border-4 border-amber-900 py-2 w-full">
      <h1 className="text-3xl font-bold text-amber-900 text-center font-serif">
        Retro Todo List
      </h1>
    </header>
  );
};
export default Header;
