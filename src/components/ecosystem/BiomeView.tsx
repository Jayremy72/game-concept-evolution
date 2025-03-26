
import React from "react";
import { cn } from "@/lib/utils";
import { Cloud, Droplets, Sun } from "lucide-react";
import { Organism } from "@/types/ecosystem";
import { getEvolutionInfo } from "@/utils/evolutionSystem";
import { Season } from "@/hooks/useSeasons";

interface BiomeViewProps {
  biomeType: string;
  organisms: Organism[];
  onBiomeClick: (x: number, y: number) => void;
  selectedSpecies: string | null;
  onOrganismClick: (id: string) => void;
  waterLevel: number;
  sunlightLevel: number;
  currentSeason?: Season;
}

const BiomeView = ({
  biomeType,
  organisms,
  onBiomeClick,
  selectedSpecies,
  onOrganismClick,
  waterLevel,
  sunlightLevel,
  currentSeason = "spring"
}: BiomeViewProps) => {
  // Define biome background based on type and season
  const getBiomeBackground = () => {
    // Base biome colors
    let biomeBaseClass = "";
    switch (biomeType) {
      case "forest":
        biomeBaseClass = "from-green-300 to-green-600";
        break;
      case "desert":
        biomeBaseClass = "from-yellow-200 to-yellow-500";
        break;
      case "ocean":
        biomeBaseClass = "from-blue-300 to-blue-600";
        break;
      default:
        biomeBaseClass = "from-green-300 to-green-600"; // Default to forest
    }
    
    // Apply seasonal modifications
    if (biomeType === "forest") {
      switch (currentSeason) {
        case "spring":
          return `bg-gradient-to-b from-green-200 to-green-500`;
        case "summer":
          return `bg-gradient-to-b from-green-300 to-green-600`;
        case "autumn":
          return `bg-gradient-to-b from-orange-200 to-yellow-600`;
        case "winter":
          return `bg-gradient-to-b from-blue-100 to-gray-300`;
      }
    } else if (biomeType === "desert") {
      switch (currentSeason) {
        case "summer":
          return `bg-gradient-to-b from-yellow-100 to-yellow-600`;
        case "winter":
          return `bg-gradient-to-b from-yellow-200 to-yellow-400`;
        default:
          return `bg-gradient-to-b ${biomeBaseClass}`;
      }
    } else {
      return `bg-gradient-to-b ${biomeBaseClass}`;
    }
  };

  // Get seasonal overlay
  const getSeasonalOverlay = () => {
    switch (currentSeason) {
      case "winter":
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute text-white text-3xl animate-fall"
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    animationDuration: `${5 + Math.random() * 10}s`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                >
                  ❄️
                </div>
              ))}
            </div>
          </div>
        );
      case "autumn":
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute text-orange-500 text-3xl animate-fall animate-spin-slow"
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    animationDuration: `${8 + Math.random() * 7}s`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                >
                  🍂
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getOrganismStyles = (type: string, stage: number) => {
    // Base styles based on type
    let baseStyle = "";
    switch (type) {
      case "tree":
        baseStyle = "text-green-800";
        break;
      case "grass":
        baseStyle = "text-green-500";
        break;
      case "flower":
        baseStyle = "text-pink-500";
        break;
      case "rabbit":
        baseStyle = "text-gray-400";
        break;
      case "fox":
        baseStyle = "text-orange-500";
        break;
      case "fungi":
        baseStyle = "text-purple-400";
        break;
      default:
        baseStyle = "text-gray-800";
    }
    
    // Size based on evolution stage
    const sizeClass = stage === 0 ? "text-xl" : stage === 1 ? "text-2xl" : "text-3xl";
    
    // Special seasonal styles
    if (currentSeason === "winter" && (type === "tree" || type === "grass")) {
      baseStyle = "text-gray-600"; // Winter dormancy for plants
    } else if (currentSeason === "autumn" && type === "tree") {
      baseStyle = "text-orange-700"; // Fall colors for trees
    }
    
    return `${baseStyle} ${sizeClass}`;
  };

  const getOrganismIcon = (type: string, stage: number) => {
    const evolutionInfo = getEvolutionInfo(type, stage);
    return evolutionInfo.icon;
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
        {/* Seasonal overlay effects */}
        {getSeasonalOverlay()}
        
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
        {organisms.map((org) => {
          const evolutionInfo = getEvolutionInfo(org.type, org.stage);
          return (
            <div
              key={org.id}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer",
                getOrganismStyles(org.type, org.stage)
              )}
              style={{ left: `${org.position.x}%`, top: `${org.position.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                onOrganismClick(org.id);
              }}
              title={`${evolutionInfo.name} (Health: ${org.health}, Adaptation: ${org.adaptationPoints})`}
            >
              {getOrganismIcon(org.type, org.stage)}
              {org.adaptationPoints > 0 && (
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {Math.min(org.stage + 1, 2)}
                </div>
              )}
            </div>
          );
        })}

        {/* Ground layer for forest biome */}
        {biomeType === "forest" && (
          <div className={`absolute bottom-0 w-full h-1/6 ${
            currentSeason === "winter" ? "bg-gradient-to-t from-gray-100 to-gray-300" : 
            currentSeason === "autumn" ? "bg-gradient-to-t from-orange-800 to-orange-600" :
            "bg-gradient-to-t from-brown-600 to-green-700"
          }`}></div>
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
