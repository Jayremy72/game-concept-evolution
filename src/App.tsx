
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/ecosystem/Game';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* App Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Ecosystem Architect</h1>
        </header>

        {/* Main Content */}
        <div className="flex-grow p-2 overflow-hidden">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </div>

        {/* Toast notifications */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
