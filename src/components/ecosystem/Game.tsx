
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
    adjustSunlight
  } = useBiome();
  
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

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

  // Calculate the evolution panel height based on number of unique organism types
  const organismTypeStages = new Set(organisms.map(org => `${org.type}-${org.stage}`));
  const evolutionPanelMinHeight = Math.max(300, organismTypeStages.size * 150);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col md:flex-row gap-4 flex-grow">
        <div className="md:w-3/4 flex flex-col">
          <StatsPanel 
            biomeHealth={biomeHealth} 
            waterLevel={waterLevel}
            sunlightLevel={sunlightLevel}
            onAdjustWater={adjustWater}
            onAdjustSunlight={adjustSunlight}
          />
          <div className="mt-4 flex-grow">
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
        </div>
        <div className="md:w-1/4">
          <ResizablePanelGroup direction="vertical" className="min-h-[400px]">
            <ResizablePanel defaultSize={70} minSize={30}>
              <EvolutionPanel organisms={organisms} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="h-full overflow-hidden">
                <SpeciesPanel 
                  biomeType={biome} 
                  onSelectSpecies={handleSpeciesSelect} 
                  selectedSpecies={selectedSpecies}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Game;
