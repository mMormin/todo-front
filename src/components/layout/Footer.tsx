import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-4 text-gray-500">
      © {new Date().getFullYear()} Maxime Mormin-Boudot
    </footer>
  );
};
export default Footer;
