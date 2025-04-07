import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-4 text-gray-500">
      © {new Date().getFullYear()} Mon site cool
    </footer>
  );
};
export default Footer;
