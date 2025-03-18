
import React from "react";
import { cn } from "@/lib/utils";
import { Cloud, Droplets, Sun } from "lucide-react";
import { Organism } from "@/types/ecosystem";

interface BiomeViewProps {
  biomeType: string;
  organisms: Organism[];
  onBiomeClick: (x: number, y: number) => void;
  selectedSpecies: string | null;
  onOrganismClick: (id: string) => void;
  waterLevel: number;
  sunlightLevel: number;
}

const BiomeView = ({
  biomeType,
  organisms,
  onBiomeClick,
  selectedSpecies,
  onOrganismClick,
  waterLevel,
  sunlightLevel
}: BiomeViewProps) => {
  // Define biome background based on type
  const getBiomeBackground = () => {
    switch (biomeType) {
      case "forest":
        return "bg-gradient-to-b from-green-300 to-green-600";
      case "desert":
        return "bg-gradient-to-b from-yellow-200 to-yellow-500";
      case "ocean":
        return "bg-gradient-to-b from-blue-300 to-blue-600";
      default:
        return "bg-gradient-to-b from-green-300 to-green-600"; // Default to forest
    }
  };

  const getOrganismStyles = (type: string) => {
    switch (type) {
      case "tree":
        return "text-green-800 text-3xl";
      case "grass":
        return "text-green-500 text-xl";
      case "flower":
        return "text-pink-500 text-xl";
      case "rabbit":
        return "text-gray-400 text-xl";
      case "fox":
        return "text-orange-500 text-xl";
      case "fungi":
        return "text-purple-400 text-xl";
      default:
        return "text-gray-800 text-xl";
    }
  };

  const getOrganismIcon = (type: string) => {
    switch (type) {
      case "tree":
        return "🌳";
      case "grass":
        return "🌿";
      case "flower":
        return "🌸";
      case "rabbit":
        return "🐰";
      case "fox":
        return "🦊";
      case "fungi":
        return "🍄";
      default:
        return "❓";
    }
  };

  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onBiomeClick(x, y);
  };

  return (
    <div className="relative h-[70vh] rounded-lg overflow-hidden shadow-lg">
      <div
        className={cn(
          "absolute inset-0 w-full h-full cursor-pointer",
          getBiomeBackground()
        )}
        onClick={handleAreaClick}
      >
        {/* Dynamic environment indicators */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <div className="bg-white/30 backdrop-blur-sm p-2 rounded-full">
            <Sun className={cn("h-6 w-6", sunlightLevel > 50 ? "text-yellow-400" : "text-yellow-200")} />
          </div>
          <div className="bg-white/30 backdrop-blur-sm p-2 rounded-full">
            <Droplets className={cn("h-6 w-6", waterLevel > 50 ? "text-blue-500" : "text-blue-300")} />
          </div>
          <div className="bg-white/30 backdrop-blur-sm p-2 rounded-full">
            <Cloud className="h-6 w-6 text-white" />
          </div>
        </div>

        {selectedSpecies && (
          <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-gray-800/80 p-2 rounded-md shadow-md">
            <p className="text-sm">Click to place: {selectedSpecies}</p>
          </div>
        )}

        {/* Render organisms */}
        {organisms.map((org) => (
          <div
            key={org.id}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer",
              getOrganismStyles(org.type)
            )}
            style={{ left: `${org.position.x}%`, top: `${org.position.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              onOrganismClick(org.id);
            }}
            title={`${org.type} (Health: ${org.health})`}
          >
            {getOrganismIcon(org.type)}
          </div>
        ))}

        {/* Ground layer for forest biome */}
        {biomeType === "forest" && (
          <div className="absolute bottom-0 w-full h-1/6 bg-gradient-to-t from-brown-600 to-green-700"></div>
        )}
        
        {/* Sand for desert biome */}
        {biomeType === "desert" && (
          <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-yellow-700 to-yellow-500"></div>
        )}
        
        {/* Water bottom for ocean biome */}
        {biomeType === "ocean" && (
          <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-blue-900 to-blue-400 opacity-80"></div>
        )}
      </div>
    </div>
  );
};

export default BiomeView;
