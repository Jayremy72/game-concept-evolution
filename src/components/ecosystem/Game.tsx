
import React, { useState } from "react";
import BiomeView from "./BiomeView";
import SpeciesPanel from "./SpeciesPanel";
import StatsPanel from "./StatsPanel";
import EvolutionPanel from "./EvolutionPanel";
import { useToast } from "@/components/ui/use-toast";
import { useBiome } from "@/hooks/useBiome";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Pause, Play, FastForward, ArrowRightFromLine, ArrowLeftFromLine } from "lucide-react";

const Game = () => {
  const { toast } = useToast();
  const { 
    biome, 
    biomeHealth, 
    addOrganism, 
    organisms, 
    removeOrganism,
    waterLevel,
    sunlightLevel,
    adjustWater,
    adjustSunlight,
    simulationSpeed,
    adjustSimulationSpeed,
    isPaused,
    togglePause
  } = useBiome();
  
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [isEvolutionPanelCollapsed, setIsEvolutionPanelCollapsed] = useState(false);

  const handleSpeciesSelect = (speciesId: string) => {
    setSelectedSpecies(speciesId);
    toast({
      title: "Species Selected",
      description: `Place the ${speciesId} in your ecosystem.`,
      duration: 2000,
    });
  };

  const handleBiomeClick = (x: number, y: number) => {
    if (selectedSpecies) {
      const success = addOrganism(selectedSpecies, { x, y });
      if (success) {
        toast({
          title: "Organism Added",
          description: `Added ${selectedSpecies} to your ecosystem.`,
          duration: 2000,
        });
        setSelectedSpecies(null);
      } else {
        toast({
          title: "Cannot Add Organism",
          description: "This area is already occupied or unsuitable.",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  };

  const handleOrganismClick = (id: string) => {
    const organism = organisms.find(o => o.id === id);
    if (organism) {
      // Show evolution info before removing
      const { type, stage, adaptationPoints, health, traits } = organism;
      toast({
        title: `Removing ${type} (Stage ${stage + 1})`,
        description: `Health: ${Math.round(health)}, Adaptation: ${Math.round(adaptationPoints)}, Traits: ${traits.join(", ")}`,
        duration: 3000,
      });
    }
    removeOrganism(id);
  };

  const toggleEvolutionPanel = () => {
    setIsEvolutionPanelCollapsed(!isEvolutionPanelCollapsed);
  };

  return (
    <div className="flex h-full gap-4">
      {/* Main content and evolution panel */}
      <div className="flex-grow flex gap-4">
        {/* Left side: Biome view and controls */}
        <div className="flex-grow flex flex-col h-full">
          {/* Stats Panel (above) */}
          <StatsPanel 
            biomeHealth={biomeHealth} 
            waterLevel={waterLevel}
            sunlightLevel={sunlightLevel}
            onAdjustWater={adjustWater}
            onAdjustSunlight={adjustSunlight}
          />
          
          {/* Simulation Speed Controls */}
          <div className="flex items-center gap-2 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={togglePause} 
              title={isPaused ? "Resume Simulation" : "Pause Simulation"}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            
            <div className="flex items-center gap-2 flex-grow">
              <span className="text-xs">Speed:</span>
              <Slider 
                value={[simulationSpeed]} 
                min={1} 
                max={10} 
                step={1} 
                onValueChange={(values) => adjustSimulationSpeed(values[0])}
                className="flex-grow"
              />
              <span className="text-xs font-mono w-6 text-center">{simulationSpeed}x</span>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustSimulationSpeed(Math.min(10, simulationSpeed + 1))}
              disabled={simulationSpeed >= 10}
              title="Increase Speed"
            >
              <FastForward className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Ecosystem Window (middle) */}
          <div className="flex-grow my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <BiomeView 
              biomeType={biome}
              organisms={organisms}
              onBiomeClick={handleBiomeClick}
              selectedSpecies={selectedSpecies}
              onOrganismClick={handleOrganismClick}
              waterLevel={waterLevel}
              sunlightLevel={sunlightLevel}
            />
          </div>
          
          {/* Species Panel (below) */}
          <div className="h-40 min-h-40 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <SpeciesPanel 
              biomeType={biome} 
              onSelectSpecies={handleSpeciesSelect} 
              selectedSpecies={selectedSpecies}
            />
          </div>
        </div>
        
        {/* Right side: Evolution Panel with collapse toggle */}
        <div className="relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8"
            onClick={toggleEvolutionPanel}
            title={isEvolutionPanelCollapsed ? "Show Evolution Panel" : "Hide Evolution Panel"}
          >
            {isEvolutionPanelCollapsed ? 
              <ArrowLeftFromLine className="h-4 w-4" /> : 
              <ArrowRightFromLine className="h-4 w-4" />
            }
          </Button>
          
          <div className={`transition-all duration-300 ${isEvolutionPanelCollapsed ? 'w-0 opacity-0' : 'w-[300px] opacity-100'} h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden`}>
            {!isEvolutionPanelCollapsed && <EvolutionPanel organisms={organisms} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
