import React, { useState } from "react";
import Main from "./Main";
import Header from "./layout/Header";

function App() {
  return (
    <div className="min-h-screen mx-20 flex flex-col justify-center items-center bg-amber-50 px-8 font-mono">
      <div className="w-full max-w-[500px] flex flex-col justify-center items-center gap-4">
        <Header />
        <Main />
      </div>
    </div>
  );
}

export default App;
