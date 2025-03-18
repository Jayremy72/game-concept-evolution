
import { useState, useEffect } from "react";
import { Organism } from "@/types/ecosystem";
import { v4 as uuidv4 } from "uuid";

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
  
  // Create interactions between species and environment
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update organism health based on environmental factors
      const updatedOrganisms = organisms.map(org => {
        let healthChange = 0;
        
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
        
        // Apply random small variations
        healthChange += Math.random() * 2 - 1;
        
        return {
          ...org,
          health: Math.max(0, Math.min(100, org.health + healthChange))
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
    }, 2000); // Run simulation every 2 seconds
    
    return () => clearInterval(intervalId);
  }, [organisms, waterLevel, sunlightLevel]);

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
    
    // Add the organism
    const newOrganism: Organism = {
      id: uuidv4(),
      type,
      position,
      health: 100, // Start with full health
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

  return {
    biome,
    biomeHealth,
    organisms,
    waterLevel,
    sunlightLevel,
    addOrganism,
    removeOrganism,
    adjustWater,
    adjustSunlight,
  };
}
