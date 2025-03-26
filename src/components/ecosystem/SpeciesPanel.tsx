
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SpeciesPanelProps {
  biomeType: string;
  onSelectSpecies: (speciesId: string) => void;
  selectedSpecies: string | null;
}

const SpeciesPanel = ({ biomeType, onSelectSpecies, selectedSpecies }: SpeciesPanelProps) => {
  // Define available species based on biome type
  const getAvailableSpecies = () => {
    const producers = [];
    const consumers = [];
    const decomposers = [];

    switch (biomeType) {
      case "forest":
        producers.push({ id: "tree", name: "Tree", icon: "🌳" });
        producers.push({ id: "grass", name: "Grass", icon: "🌿" });
        producers.push({ id: "flower", name: "Flower", icon: "🌸" });
        
        consumers.push({ id: "rabbit", name: "Rabbit", icon: "🐰" });
        consumers.push({ id: "fox", name: "Fox", icon: "🦊" });
        
        decomposers.push({ id: "fungi", name: "Fungi", icon: "🍄" });
        break;
      case "desert":
        producers.push({ id: "cactus", name: "Cactus", icon: "🌵" });
        producers.push({ id: "bush", name: "Desert Bush", icon: "🌿" });
        
        consumers.push({ id: "lizard", name: "Lizard", icon: "🦎" });
        consumers.push({ id: "snake", name: "Snake", icon: "🐍" });
        
        decomposers.push({ id: "beetle", name: "Beetle", icon: "🪲" });
        break;
      case "ocean":
        producers.push({ id: "seaweed", name: "Seaweed", icon: "🌱" });
        producers.push({ id: "coral", name: "Coral", icon: "🪸" });
        
        consumers.push({ id: "fish", name: "Fish", icon: "🐟" });
        consumers.push({ id: "crab", name: "Crab", icon: "🦀" });
        
        decomposers.push({ id: "starfish", name: "Starfish", icon: "⭐" });
        break;
      default:
        // Default to forest if biome type not recognized
        producers.push({ id: "tree", name: "Tree", icon: "🌳" });
        producers.push({ id: "grass", name: "Grass", icon: "🌿" });
        
        consumers.push({ id: "rabbit", name: "Rabbit", icon: "🐰" });
        
        decomposers.push({ id: "fungi", name: "Fungi", icon: "🍄" });
    }

    return { producers, consumers, decomposers };
  };

  const { producers, consumers, decomposers } = getAvailableSpecies();

  const renderSpeciesButton = (species: { id: string; name: string; icon: string }) => (
    <Button
      key={species.id}
      variant={selectedSpecies === species.id ? "default" : "outline"}
      className={cn(
        "flex items-center justify-start space-x-2 w-full mb-2",
        selectedSpecies === species.id && "ring-2 ring-primary"
      )}
      onClick={() => onSelectSpecies(species.id)}
    >
      <span className="text-xl">{species.icon}</span>
      <span>{species.name}</span>
    </Button>
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3">Add Species</h2>
      
      <Tabs defaultValue="producers">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="producers" className="flex-1">Producers</TabsTrigger>
          <TabsTrigger value="consumers" className="flex-1">Consumers</TabsTrigger>
          <TabsTrigger value="decomposers" className="flex-1">Decomposers</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[300px]">
          <TabsContent value="producers" className="mt-0">
            <div className="space-y-1">
              {producers.map(renderSpeciesButton)}
            </div>
          </TabsContent>
          
          <TabsContent value="consumers" className="mt-0">
            <div className="space-y-1">
              {consumers.map(renderSpeciesButton)}
            </div>
          </TabsContent>
          
          <TabsContent value="decomposers" className="mt-0">
            <div className="space-y-1">
              {decomposers.map(renderSpeciesButton)}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click on a species to select it, then click on the biome to place it.
        </p>
      </div>
    </div>
  );
};

export default SpeciesPanel;
