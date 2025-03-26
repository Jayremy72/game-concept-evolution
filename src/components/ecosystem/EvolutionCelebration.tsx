
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { Organism } from "@/types/ecosystem";
import { getEvolutionInfo } from "@/utils/evolutionSystem";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EvolutionCelebrationProps {
  organism: Organism;
  onClose: () => void;
}

const EvolutionCelebration: React.FC<EvolutionCelebrationProps> = ({
  organism,
  onClose
}) => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [countdown, setCountdown] = useState(5);
  
  // Get evolution information
  const currentEvolution = getEvolutionInfo(organism.type, organism.stage);
  const previousEvolution = getEvolutionInfo(organism.type, organism.stage - 1);
  
  // Update dimensions when window resizes and handle auto-close
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Auto-close after 5 seconds
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up event listeners and timers
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, [onClose]);
  
  // Only show celebration for stages 1 and 2 (not stage 0)
  if (organism.stage === 0) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.2}
      />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md w-full text-center relative overflow-hidden">
        {/* Close button - Made larger and more obvious */}
        <Button 
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-20"
          aria-label="Close celebration"
        >
          <X className="h-5 w-5" />
        </Button>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-repeat" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='0' y='15' font-size='15'%3E${
                currentEvolution.icon === '🌳' ? '%F0%9F%8C%B3' : encodeURIComponent(currentEvolution.icon)
              }%3C/text%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }} 
          />
        </div>
        
        <div className="relative z-10">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Evolution Unlocked!
          </div>
          
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
            <span className="text-4xl mr-3">{currentEvolution.icon}</span>
            <span>{currentEvolution.name}</span>
          </h2>
          
          <div className="flex justify-center items-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-3xl mb-1">{previousEvolution.icon}</div>
              <div className="text-sm">{previousEvolution.name}</div>
            </div>
            
            <div className="text-xl">➡️</div>
            
            <div className="text-center relative animate-pulse">
              <div className="text-3xl mb-1">{currentEvolution.icon}</div>
              <div className="text-sm font-medium">{currentEvolution.name}</div>
              <div className="absolute -top-2 -right-2">✨</div>
            </div>
          </div>
          
          <p className="text-sm italic mb-4">
            "{currentEvolution.description}"
          </p>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-1">New Traits Unlocked:</h3>
            <div className="flex flex-wrap gap-1 justify-center">
              {currentEvolution.traits
                .filter(trait => !previousEvolution.traits.includes(trait))
                .map((trait, index) => (
                  <Badge
                    key={index}
                    className="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100"
                  >
                    {trait}
                  </Badge>
                ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Auto-closing in {countdown} seconds...
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvolutionCelebration;
