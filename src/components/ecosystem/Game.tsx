
import React, { useState } from "react";
import BiomeView from "./BiomeView";
import SpeciesPanel from "./SpeciesPanel";
import StatsPanel from "./StatsPanel";
import EvolutionPanel from "./EvolutionPanel";
import SeasonIndicator from "./SeasonIndicator";
import StatsDashboard from "./StatsDashboard";
import OrganismInspector from "./OrganismInspector";
import { useToast } from "@/hooks/use-toast";
import { useBiome } from "@/hooks/useBiome";
import { useSeasons } from "@/hooks/useSeasons";
import { useEcosystemStats } from "@/hooks/useEcosystemStats";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Pause, Play, FastForward, ArrowRightFromLine, 
  ArrowLeftFromLine, BarChart4, Calendar, ChevronDown,
  Settings2, Droplets, Sun, Users
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Organism } from "@/types/ecosystem";

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
    togglePause,
    reproductionEvents
  } = useBiome();
  
  const { 
    currentSeason, 
    seasonData, 
    seasonProgress, 
    changeSeason 
  } = useSeasons(simulationSpeed);
  
  const {
    stats,
    clearStats
  } = useEcosystemStats(organisms, biomeHealth, waterLevel, sunlightLevel);
  
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [isEvolutionPanelCollapsed, setIsEvolutionPanelCollapsed] = useState(false);
  const [showStatsDashboard, setShowStatsDashboard] = useState(false);
  const [inspectedOrganism, setInspectedOrganism] = useState<Organism | null>(null);

  const handleSpeciesSelect = (speciesId: string) => {
    setSelectedSpecies(speciesId);
    toast({
      title: "Species Selected",
      description: `Place the ${speciesId} in your ecosystem.`,
      duration: 2000,
    });
  };

  const handleAddOrganism = (type: string, position: { x: number, y: number }) => {
    if (selectedSpecies) {
      const success = addOrganism(selectedSpecies, position);
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
      return success;
    }
    return false;
  };

  const handleSelectOrganism = (organism: Organism) => {
    setInspectedOrganism(organism);
  };

  const handleRemoveOrganism = (id: string) => {
    removeOrganism(id);
    setInspectedOrganism(null);
    toast({
      title: "Organism Removed",
      description: "The organism has been removed from your ecosystem.",
      duration: 2000,
    });
  };

  const toggleEvolutionPanel = () => {
    setIsEvolutionPanelCollapsed(!isEvolutionPanelCollapsed);
  };

  const toggleStatsDashboard = () => {
    setShowStatsDashboard(!showStatsDashboard);
  };

  return (
    <div className="flex h-full gap-2">
      <div className="flex-grow flex gap-2">
        <div className="flex-grow flex flex-col h-full">
          <div className="flex gap-2 mb-1">
            <StatsPanel 
              organisms={organisms}
              biomeHealth={biomeHealth} 
              waterLevel={waterLevel}
              sunlightLevel={sunlightLevel}
            />
            
            <SeasonIndicator 
              currentSeason={currentSeason}
              seasonProgress={seasonProgress}
              className="w-60"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-1 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
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
            
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleStatsDashboard}
                title="View Statistics"
              >
                <BarChart4 className="h-4 w-4" />
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Season Settings"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Season Settings</SheetTitle>
                    <SheetDescription>
                      Adjust the current season and see how it affects your ecosystem.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <h3 className="mb-2 text-sm font-medium">Change Season</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={currentSeason === "spring" ? "default" : "outline"}
                        className="justify-start gap-2"
                        onClick={() => changeSeason("spring")}
                      >
                        <span className="text-xl">🌱</span>
                        Spring
                      </Button>
                      <Button 
                        variant={currentSeason === "summer" ? "default" : "outline"}
                        className="justify-start gap-2"
                        onClick={() => changeSeason("summer")}
                      >
                        <span className="text-xl">☀️</span>
                        Summer
                      </Button>
                      <Button 
                        variant={currentSeason === "autumn" ? "default" : "outline"}
                        className="justify-start gap-2"
                        onClick={() => changeSeason("autumn")}
                      >
                        <span className="text-xl">🍂</span>
                        Autumn
                      </Button>
                      <Button 
                        variant={currentSeason === "winter" ? "default" : "outline"}
                        className="justify-start gap-2"
                        onClick={() => changeSeason("winter")}
                      >
                        <span className="text-xl">❄️</span>
                        Winter
                      </Button>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <h3 className="text-sm font-medium">Season Effects</h3>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span>Water Modifier:</span>
                        </div>
                        <span className={seasonData.waterModifier >= 0 ? "text-green-500" : "text-red-500"}>
                          {seasonData.waterModifier > 0 ? "+" : ""}{seasonData.waterModifier}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-500" />
                          <span>Sunlight Modifier:</span>
                        </div>
                        <span className={seasonData.sunlightModifier >= 0 ? "text-green-500" : "text-red-500"}>
                          {seasonData.sunlightModifier > 0 ? "+" : ""}{seasonData.sunlightModifier}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <ChevronDown className="h-4 w-4 text-green-500" />
                          <span>Growth Modifier:</span>
                        </div>
                        <span className={seasonData.growthModifier >= 1 ? "text-green-500" : "text-red-500"}>
                          x{seasonData.growthModifier.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          <div className="flex-grow border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <BiomeCanvas 
              organisms={organisms}
              waterLevel={waterLevel}
              sunlightLevel={sunlightLevel}
              biomeType={biome}
              selectedSpecies={selectedSpecies}
              onAddOrganism={handleAddOrganism}
              onSelectOrganism={handleSelectOrganism}
              isPaused={isPaused}
              reproductionEvents={reproductionEvents}
            />
          </div>
          
          <div className="h-32 min-h-32 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <SpeciesPanel 
              biomeType={biome} 
              onSelectSpecies={handleSpeciesSelect} 
              selectedSpecies={selectedSpecies}
            />
          </div>
        </div>
        
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
          
          <div className={`transition-all duration-300 ${isEvolutionPanelCollapsed ? 'w-0 opacity-0' : 'w-[250px] opacity-100'} h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden`}>
            {!isEvolutionPanelCollapsed && <EvolutionPanel organisms={organisms} />}
          </div>
        </div>
      </div>
      
      {showStatsDashboard && (
        <StatsDashboard 
          stats={stats} 
          onClose={toggleStatsDashboard}
          clearStats={clearStats}
        />
      )}
      
      {inspectedOrganism && (
        <OrganismInspector 
          organism={inspectedOrganism} 
          onClose={() => setInspectedOrganism(null)}
          waterLevel={waterLevel}
          sunlightLevel={sunlightLevel}
        />
      )}
    </div>
  );
};

export default Game;
