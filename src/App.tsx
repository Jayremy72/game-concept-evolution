
import React from 'react';
import Game from './components/ecosystem/Game';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* App Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Ecosystem Architect</h1>
      </header>

      {/* Main Content */}
      <div className="flex-grow p-2 overflow-hidden">
        <Game />
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}

export default App;
