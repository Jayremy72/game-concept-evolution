
import React from "react";
import Game from "@/components/ecosystem/Game";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  
  const handleTutorial = () => {
    toast({
      title: "Welcome to Ecosystem Architect!",
      description: "Create a balanced ecosystem by adding different species. Keep an eye on the health indicators!",
      duration: 5000,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
      <header className="py-2 px-3 bg-white dark:bg-gray-900 shadow-md">
        <div className="flex justify-between items-center w-full mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400">
            Ecosystem Architect
          </h1>
          <Button variant="outline" size="sm" onClick={handleTutorial}>
            How to Play
          </Button>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-1 overflow-hidden">
        <div className="w-full h-full max-w-[1800px]"> {/* Increased max width from 1600px to 1800px */}
          <Game />
        </div>
      </main>
      
      <footer className="py-1 px-3 bg-white dark:bg-gray-900 text-center text-xs text-gray-500 dark:text-gray-400">
        Ecosystem Architect - Balance your biome and watch it thrive!
      </footer>
    </div>
  );
};

export default Index;
