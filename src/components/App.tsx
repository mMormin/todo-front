import React, { useState } from "react";
import Main from "./Main";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

function App() {
  return (
    <div className="min-h-screen lg:mx-20 flex flex-col justify-center items-center bg-amber-50 px-8 font-mono">
      <div className="w-full max-w-[500px] flex flex-col justify-center items-center gap-4">
        <Header />
        <Main />
      </div>

      <Footer />
    </div>
  );
}

export default App;
