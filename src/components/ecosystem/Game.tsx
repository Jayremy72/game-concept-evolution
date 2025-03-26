
import React, { useState } from "react";
import BiomeView from "./BiomeView";
import SpeciesPanel from "./SpeciesPanel";
import StatsPanel from "./StatsPanel";
import EvolutionPanel from "./EvolutionPanel";
import { useToast } from "@/components/ui/use-toast";
import { useBiome } from "@/hooks/useBiome";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
      <div className="md:col-span-3 order-2 md:order-1">
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
      <div className="md:col-span-1 space-y-4 order-1 md:order-2">
        <StatsPanel 
          biomeHealth={biomeHealth} 
          waterLevel={waterLevel}
          sunlightLevel={sunlightLevel}
          onAdjustWater={adjustWater}
          onAdjustSunlight={adjustSunlight}
        />
        <EvolutionPanel organisms={organisms} />
        <SpeciesPanel 
          biomeType={biome} 
          onSelectSpecies={handleSpeciesSelect} 
          selectedSpecies={selectedSpecies}
        />
      </div>
    </div>
  );
};

export default Game;
