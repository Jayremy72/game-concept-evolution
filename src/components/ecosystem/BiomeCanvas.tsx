
import React, { useRef, useState, useEffect } from "react";
import { Organism } from "@/types/ecosystem";
import EvolutionIndicator from "./EvolutionIndicator";
import { useEcosystemStats } from "@/hooks/useEcosystemStats";
import { toast } from "sonner";
import { ReproductionEvent } from "@/utils/reproductionSystem";

interface BiomeCanvasProps {
  organisms: Organism[];
  waterLevel: number;
  sunlightLevel: number;
  biomeType: string;
  selectedSpecies: string | null;
  reproductionEvents?: ReproductionEvent[];
  onAddOrganism: (type: string, position: { x: number; y: number }) => boolean;
  onSelectOrganism: (organism: Organism) => void;
  isPaused: boolean;
}

const BiomeCanvas: React.FC<BiomeCanvasProps> = ({
  organisms,
  waterLevel,
  sunlightLevel,
  biomeType,
  selectedSpecies,
  reproductionEvents = [],
  onAddOrganism,
  onSelectOrganism,
  isPaused
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { getEvolutionMetrics } = useEcosystemStats(organisms, 0, 0, 0);
  const [highlightedEvolutions, setHighlightedEvolutions] = useState<string[]>([]);
  
  // Setup canvas dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  
  // Track evolution events
  const evolutionTracker = useRef(new Map<string, number>());
  
  useEffect(() => {
    // Track organisms that have evolved since last check
    const now = Date.now();
    const newlyEvolved: string[] = [];
    
    organisms.forEach(org => {
      const lastRecordedStage = evolutionTracker.current.get(org.id) || 0;
      
      // If organism evolved
      if (org.stage > lastRecordedStage) {
        // Update our tracker
        evolutionTracker.current.set(org.id, org.stage);
        
        // Add to newly evolved list
        newlyEvolved.push(org.id);
        
        // Notify user
        toast.success(`Evolution: ${org.type} evolved to Stage ${org.stage + 1}!`, {
          description: `The ${org.type} has gained new traits: ${org.traits.join(", ")}`,
          duration: 3000,
        });
      }
    });
    
    if (newlyEvolved.length > 0) {
      // Highlight newly evolved organisms
      setHighlightedEvolutions(newlyEvolved);
      
      // Remove highlight after animation
      const timer = setTimeout(() => {
        setHighlightedEvolutions([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [organisms]);
  
  // Get background based on biome type
  const getBiomeBackground = () => {
    switch (biomeType) {
      case "forest":
        return `radial-gradient(circle, rgba(76,175,80,0.3) 0%, rgba(27,94,32,0.5) 100%)`;
      case "desert":
        return `radial-gradient(circle, rgba(255,235,59,0.3) 0%, rgba(245,124,0,0.4) 100%)`;
      case "ocean":
        return `radial-gradient(circle, rgba(33,150,243,0.3) 0%, rgba(21,101,192,0.5) 100%)`;
      default:
        return `radial-gradient(circle, rgba(76,175,80,0.3) 0%, rgba(27,94,32,0.5) 100%)`;
    }
  };
  
  // Handle click on biome canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !selectedSpecies) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const success = onAddOrganism(selectedSpecies, { x, y });
    
    if (!success) {
      toast.error("Cannot place organism here", { 
        description: "The position is either occupied or environmental conditions are not suitable."
      });
    }
  };
  
  return (
    <div 
      ref={canvasRef}
      className={`relative w-full h-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner ${
        isPaused ? 'opacity-75' : ''
      }`}
      style={{ 
        background: getBiomeBackground(),
        cursor: selectedSpecies ? 'cell' : 'default'
      }}
      onClick={handleCanvasClick}
    >
      {/* Water level indicator */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-blue-500/20 backdrop-blur-[1px] transition-all duration-1000 ease-in-out pointer-events-none"
        style={{ height: `${waterLevel}%` }}
      />
      
      {/* Sunlight indicator */}
      <div 
        className="absolute inset-0 bg-yellow-500/10 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: sunlightLevel / 100 }}
      />
      
      {/* Paused overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="bg-white dark:bg-gray-800 rounded-md px-4 py-2 shadow-lg">
            <span className="text-lg font-medium">PAUSED</span>
          </div>
        </div>
      )}
      
      {/* Reproduction events visualization */}
      {reproductionEvents.map((event) => (
        <div
          key={event.id}
          className="absolute z-30 pointer-events-none"
          style={{
            left: `${event.position.x}%`,
            top: `${event.position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-green-400 opacity-75"></div>
          <div className="relative inline-flex rounded-full h-6 w-6 bg-green-500 text-white items-center justify-center text-xs">
            <span className="animate-pulse">♥</span>
          </div>
        </div>
      ))}
      
      {/* Render organisms */}
      {organisms.map((organism) => {
        const isHighlighted = highlightedEvolutions.includes(organism.id);
        const isNewborn = organism.birthTime && Date.now() - organism.birthTime < 5000;
        
        return (
          <div
            key={organism.id}
            className={`absolute transition-all duration-300 z-10 ${
              isHighlighted ? 'animate-bounce z-20' : ''
            } ${
              isNewborn ? 'scale-75 animate-pulse' : ''
            }`}
            style={{
              left: `${organism.position.x}%`,
              top: `${organism.position.y}%`,
              transform: 'translate(-50%, -50%)',
              filter: `opacity(${organism.health / 100})`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectOrganism(organism);
            }}
          >
            <EvolutionIndicator 
              organism={organism} 
            />
          </div>
        );
      })}
      
      {/* Organism Count */}
      <div className="absolute top-2 left-2 bg-white/80 dark:bg-gray-800/80 rounded-md p-1 text-xs">
        <div>Population: {organisms.length}</div>
      </div>
      
      {/* Evolution metrics overlay */}
      {organisms.length > 0 && (
        <div className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 rounded-md p-1 text-xs">
          <div>{getEvolutionMetrics().totalEvolutions} evolutions</div>
        </div>
      )}
    </div>
  );
};

export default BiomeCanvas;
