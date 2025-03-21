
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
        "flex items-center justify-start space-x-2 h-10",
        selectedSpecies === species.id && "ring-2 ring-primary"
      )}
      onClick={() => onSelectSpecies(species.id)}
    >
      <span className="text-xl mr-1">{species.icon}</span>
      <span>{species.name}</span>
    </Button>
  );

  return (
    <div className="h-full bg-white dark:bg-gray-800 p-2">
      <Tabs defaultValue="producers" className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Add Species</h2>
          <TabsList className="grid grid-cols-3 w-auto">
            <TabsTrigger value="producers">Producers</TabsTrigger>
            <TabsTrigger value="consumers">Consumers</TabsTrigger>
            <TabsTrigger value="decomposers">Decomposers</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-grow overflow-auto">
          <TabsContent value="producers" className="h-full m-0 p-0">
            <ScrollArea className="h-full">
              <div className="flex flex-wrap gap-2">
                {producers.map(renderSpeciesButton)}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="consumers" className="h-full m-0 p-0">
            <ScrollArea className="h-full">
              <div className="flex flex-wrap gap-2">
                {consumers.map(renderSpeciesButton)}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="decomposers" className="h-full m-0 p-0">
            <ScrollArea className="h-full">
              <div className="flex flex-wrap gap-2">
                {decomposers.map(renderSpeciesButton)}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
        
        <div className="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select a species, then click on the ecosystem to place it.
          </p>
        </div>
      </Tabs>
    </div>
  );
};

export default SpeciesPanel;
