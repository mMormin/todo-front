const Footer = () => {
  return (
    <footer className="fixed bottom-0 text-center py-2 text-white w-full bg-gray-800 z-0 border-b-2 border-amber-600">
      © {new Date().getFullYear()} Maxime Mormin-Boudot
    </footer>
  );
};
export default Footer;
