
import React, { useState } from 'react';
import { useBiome } from '@/hooks/useBiome';
import { Organism } from './types/ecosystem';
import BiomeCanvas from './components/ecosystem/BiomeCanvas';
import ControlPanel from './components/ecosystem/ControlPanel';
import StatsPanel from './components/ecosystem/StatsPanel';
import SpeciesPanel from './components/ecosystem/SpeciesPanel';
import OrganismInspector from './components/ecosystem/OrganismInspector';
import EvolutionPanel from './components/ecosystem/EvolutionPanel';
import SeasonIndicator from './components/ecosystem/SeasonIndicator';
import EvolutionCelebration from './components/ecosystem/EvolutionCelebration';
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSeasons } from './hooks/useSeasons';

function App() {
  const {
    biome,
    biomeHealth,
    organisms,
    waterLevel,
    sunlightLevel,
    simulationSpeed,
    isPaused,
    addOrganism,
    removeOrganism,
    adjustWater,
    adjustSunlight,
    adjustSimulationSpeed,
    togglePause
  } = useBiome();
  
  // Get current season information
  const { currentSeason, seasonProgress } = useSeasons(simulationSpeed);

  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(null);
  const [showEvolutionPanel, setShowEvolutionPanel] = useState(false); // Default to hidden to avoid duplication
  const [showEvolutionCelebration, setShowEvolutionCelebration] = useState<Organism | null>(null);
  const [lastEvolvedStages, setLastEvolvedStages] = useState<Map<string, number>>(new Map());

  // Track organism evolution
  React.useEffect(() => {
    organisms.forEach(org => {
      const lastStage = lastEvolvedStages.get(org.id) || 0;
      if (org.stage > lastStage) {
        // Update last known stage
        setLastEvolvedStages(prev => new Map(prev).set(org.id, org.stage));
        
        // Show celebration
        setShowEvolutionCelebration(org);
        
        // Close any open inspector
        setSelectedOrganism(null);
      }
    });
  }, [organisms]);

  const handleSelectSpecies = (speciesId: string) => {
    setSelectedSpecies(speciesId);
  };

  const handleAddOrganism = (type: string, position: { x: number; y: number }) => {
    return addOrganism(type, position);
  };

  const handleSelectOrganism = (organism: Organism) => {
    setSelectedOrganism(organism);
  };

  const handleCloseInspector = () => {
    setSelectedOrganism(null);
  };

  const handleCloseCelebration = () => {
    setShowEvolutionCelebration(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* App Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Ecosystem Architect</h1>
        <div className="flex items-center gap-2">
          <Checkbox 
            id="toggleEvolution" 
            checked={showEvolutionPanel}
            onCheckedChange={(checked) => setShowEvolutionPanel(!!checked)} 
          />
          <Label htmlFor="toggleEvolution">Show Additional Evolution Panel</Label>
        </div>
      </header>

      {/* Main Content - Made taller by reducing padding and making content take more space */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel - Species Selection & Evolution - Made narrower */}
        <div className="w-full md:w-80 bg-white dark:bg-gray-800 shadow-sm overflow-hidden flex flex-col">
          <Tabs defaultValue="species" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="species">Species</TabsTrigger>
              <TabsTrigger value="evolution">Evolution</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="species" className="flex-grow overflow-auto p-0 m-0">
              <SpeciesPanel 
                biomeType={biome} 
                onSelectSpecies={handleSelectSpecies} 
                selectedSpecies={selectedSpecies} 
              />
            </TabsContent>
            
            <TabsContent value="evolution" className="flex-grow overflow-auto p-0 m-0">
              <EvolutionPanel organisms={organisms} />
            </TabsContent>
            
            <TabsContent value="stats" className="flex-grow overflow-auto p-0 m-0">
              <StatsPanel 
                organisms={organisms} 
                biomeHealth={biomeHealth} 
                waterLevel={waterLevel} 
                sunlightLevel={sunlightLevel} 
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Center Area - Biome Canvas - Made larger by reducing padding */}
        <div className="flex-grow flex flex-col p-2 overflow-hidden">
          {/* Season Indicator */}
          <div className="mb-1">
            <SeasonIndicator 
              currentSeason={currentSeason} 
              seasonProgress={seasonProgress} 
            />
          </div>
          
          {/* Biome Canvas - Made taller */}
          <div className="flex-grow">
            <BiomeCanvas 
              organisms={organisms}
              waterLevel={waterLevel}
              sunlightLevel={sunlightLevel}
              biomeType={biome}
              selectedSpecies={selectedSpecies}
              onAddOrganism={handleAddOrganism}
              onSelectOrganism={handleSelectOrganism}
              isPaused={isPaused}
            />
          </div>
          
          {/* Control Panel - Made more compact */}
          <div className="mt-1">
            <ControlPanel 
              waterLevel={waterLevel}
              sunlightLevel={sunlightLevel}
              simulationSpeed={simulationSpeed}
              isPaused={isPaused}
              onAdjustWater={adjustWater}
              onAdjustSunlight={adjustSunlight}
              onAdjustSpeed={adjustSimulationSpeed}
              onTogglePause={togglePause}
            />
          </div>
        </div>

        {/* Conditional Right Panel - Evolution Panel - Made narrower */}
        {showEvolutionPanel && (
          <div className="w-full md:w-80 bg-white dark:bg-gray-800 shadow-sm overflow-auto">
            <EvolutionPanel organisms={organisms} />
          </div>
        )}
      </div>

      {/* Organism Inspector Modal */}
      {selectedOrganism && (
        <OrganismInspector 
          organism={selectedOrganism} 
          onClose={handleCloseInspector} 
          waterLevel={waterLevel}
          sunlightLevel={sunlightLevel}
        />
      )}
      
      {/* Evolution Celebration Modal */}
      {showEvolutionCelebration && (
        <EvolutionCelebration 
          organism={showEvolutionCelebration}
          onClose={handleCloseCelebration}
        />
      )}
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}

export default App;
