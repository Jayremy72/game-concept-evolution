
import React from "react";
import Game from "@/components/ecosystem/Game";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
      <header className="py-4 px-6 bg-white dark:bg-gray-900 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400">
            Ecosystem Architect
          </h1>
          <Button variant="outline" onClick={handleTutorial}>
            How to Play
          </Button>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <Game />
        </div>
      </main>
      
      <footer className="py-3 px-6 bg-white dark:bg-gray-900 text-center text-sm text-gray-500 dark:text-gray-400">
        Ecosystem Architect - Balance your biome and watch it thrive!
      </footer>
    </div>
  );
};

export default Index;
