
import { useState, useEffect } from "react";
import { Organism } from "@/types/ecosystem";
import { v4 as uuidv4 } from "uuid";
import { 
  getNextEvolutionStage, 
  getEvolutionInfo, 
  calculateAdaptationGain 
} from "@/utils/evolutionSystem";

interface OrganismPosition {
  x: number;
  y: number;
}

export function useBiome() {
  const [biome, setBiome] = useState<string>("forest");
  const [biomeHealth, setBiomeHealth] = useState<number>(75);
  const [organisms, setOrganisms] = useState<Organism[]>([]);
  const [waterLevel, setWaterLevel] = useState<number>(50);
  const [sunlightLevel, setSunlightLevel] = useState<number>(60);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(5);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Create interactions between species and environment
  useEffect(() => {
    if (isPaused) return;
    
    const intervalDuration = 2000 / simulationSpeed;
    
    const intervalId = setInterval(() => {
      // Update organism health based on environmental factors
      const updatedOrganisms = organisms.map(org => {
        let healthChange = 0;
        let adaptationGain = 0;
        
        // Apply environmental effects
        switch (org.type) {
          case "tree":
          case "grass":
          case "flower":
          case "cactus":
          case "bush":
          case "seaweed":
          case "coral":
            // Producers need sunlight and water
            if (sunlightLevel > 70) healthChange += 2;
            else if (sunlightLevel < 30) healthChange -= 2;
            
            if (waterLevel > 60) healthChange += 2;
            else if (waterLevel < 30) healthChange -= 3;
            break;
            
          case "rabbit":
          case "lizard":
          case "fish":
            // Herbivores need producers and moderate conditions
            const hasFood = organisms.some(o => 
              ["tree", "grass", "flower", "cactus", "bush", "seaweed", "coral"].includes(o.type)
            );
            if (hasFood) healthChange += 1;
            else healthChange -= 3;
            
            if (waterLevel < 20) healthChange -= 2;
            break;
            
          case "fox":
          case "snake":
          case "crab":
            // Predators need prey
            const hasPrey = organisms.some(o => 
              ["rabbit", "lizard", "fish"].includes(o.type)
            );
            if (hasPrey) healthChange += 1;
            else healthChange -= 2;
            break;
            
          case "fungi":
          case "beetle":
          case "starfish":
            // Decomposers thrive in many conditions
            const hasDeadMatter = organisms.some(o => o.health < 30);
            if (hasDeadMatter) healthChange += 2;
            
            if (waterLevel > 40) healthChange += 1;
            break;
        }

        // Apply traits effects
        if (org.traits.includes("drought-resistant") && waterLevel < 30) {
          healthChange += 2; // Less damage from drought
        }
        
        if (org.traits.includes("heat-resistant") && sunlightLevel > 80) {
          healthChange += 2; // Less damage from high heat
        }
        
        if (org.traits.includes("water-efficient")) {
          if (waterLevel < 40) healthChange += 1; // Better survival in low water
        }
        
        if (org.traits.includes("fast-growing") && org.health < 50) {
          healthChange += 1; // Faster recovery
        }
        
        // Apply random small variations
        healthChange += Math.random() * 2 - 1;
        
        // Calculate adaptation points gain - organisms under stress but surviving adapt
        if (org.health > 20 && org.health < 80) {
          adaptationGain = calculateAdaptationGain(org, waterLevel, sunlightLevel, biome);
        }
        
        // Check for evolution to next stage
        const newAdaptationPoints = org.adaptationPoints + adaptationGain;
        const nextStage = getNextEvolutionStage(org.type, org.stage, newAdaptationPoints);
        
        // If evolving to a new stage, get the new traits
        let newTraits = [...org.traits];
        if (nextStage > org.stage) {
          const evolutionInfo = getEvolutionInfo(org.type, nextStage);
          newTraits = evolutionInfo.traits;
        }
        
        return {
          ...org,
          health: Math.max(0, Math.min(100, org.health + healthChange)),
          adaptationPoints: newAdaptationPoints,
          stage: nextStage,
          traits: newTraits
        };
      });
      
      // Remove dead organisms
      const livingOrganisms = updatedOrganisms.filter(org => org.health > 0);
      
      // Update biome health based on biodiversity and organism health
      const totalHealth = livingOrganisms.reduce((sum, org) => sum + org.health, 0);
      const averageHealth = livingOrganisms.length > 0 ? totalHealth / livingOrganisms.length : 0;
      
      // Check for ecosystem balance
      const producerCount = livingOrganisms.filter(org => 
        ["tree", "grass", "flower", "cactus", "bush", "seaweed", "coral"].includes(org.type)
      ).length;
      
      const consumerCount = livingOrganisms.filter(org => 
        ["rabbit", "lizard", "fish", "fox", "snake", "crab"].includes(org.type)
      ).length;
      
      const decomposerCount = livingOrganisms.filter(org => 
        ["fungi", "beetle", "starfish"].includes(org.type)
      ).length;
      
      let balanceScore = 0;
      
      // Simple balance check - having all three types is good
      if (producerCount > 0) balanceScore += 25;
      if (consumerCount > 0) balanceScore += 25;
      if (decomposerCount > 0) balanceScore += 25;
      
      // Producer:Consumer ratio should be roughly 2:1
      if (producerCount >= consumerCount * 2) balanceScore += 25;
      else if (consumerCount > producerCount) balanceScore -= 25;
      
      // Update ecosystem health
      const newBiomeHealth = Math.max(10, Math.min(100, 
        averageHealth * 0.4 + balanceScore * 0.6
      ));
      
      setOrganisms(livingOrganisms);
      setBiomeHealth(newBiomeHealth);
    }, intervalDuration); // Run simulation based on speed
    
    return () => clearInterval(intervalId);
  }, [organisms, waterLevel, sunlightLevel, biome, simulationSpeed, isPaused]);

  // Add a new organism to the ecosystem
  const addOrganism = (type: string, position: OrganismPosition): boolean => {
    // Check if position is already occupied (simple collision detection)
    const isPositionOccupied = organisms.some(org => {
      const distance = Math.sqrt(
        Math.pow(org.position.x - position.x, 2) + 
        Math.pow(org.position.y - position.y, 2)
      );
      return distance < 10; // 10% of the biome width/height
    });
    
    if (isPositionOccupied) {
      return false;
    }
    
    // Check if environmental conditions are suitable
    let canSurvive = true;
    
    switch (type) {
      case "tree":
      case "flower":
        if (waterLevel < 30 || sunlightLevel < 40) canSurvive = false;
        break;
      case "cactus":
        if (waterLevel > 50) canSurvive = false;
        break;
      case "coral":
        if (waterLevel < 70) canSurvive = false;
        break;
    }
    
    if (!canSurvive) {
      return false;
    }
    
    // Get initial evolution info
    const evolutionInfo = getEvolutionInfo(type, 0);
    
    // Add the organism
    const newOrganism: Organism = {
      id: uuidv4(),
      type,
      position,
      health: 100, // Start with full health
      adaptationPoints: 0, // Start with no adaptation points
      stage: 0, // Start at the first evolution stage
      traits: evolutionInfo.traits // Get initial traits
    };
    
    setOrganisms(prev => [...prev, newOrganism]);
    return true;
  };

  // Remove an organism from the ecosystem
  const removeOrganism = (id: string) => {
    setOrganisms(prev => prev.filter(org => org.id !== id));
  };

  // Adjust water level
  const adjustWater = (level: number) => {
    setWaterLevel(level);
  };

  // Adjust sunlight level
  const adjustSunlight = (level: number) => {
    setSunlightLevel(level);
  };

  // Adjust simulation speed
  const adjustSimulationSpeed = (speed: number) => {
    setSimulationSpeed(speed);
  };

  // Toggle simulation pause state
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return {
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
  };
}
