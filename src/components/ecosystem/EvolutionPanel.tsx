
import React from "react";
import { Organism, EvolutionStage } from "@/types/ecosystem";
import { getEvolutionInfo } from "@/utils/evolutionSystem";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info, ChevronRight } from "lucide-react";

interface EvolutionPanelProps {
  organisms: Organism[];
}

const EvolutionPanel = ({ organisms }: EvolutionPanelProps) => {
  // Group organisms by type and stage
  const organizedOrganisms = organisms.reduce((acc, org) => {
    const key = `${org.type}-${org.stage}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(org);
    return acc;
  }, {} as Record<string, Organism[]>);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Evolution Progress</h2>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-full w-6 h-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              <Info className="h-4 w-4" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">About Evolution</h4>
              <p className="text-sm">
                Species accumulate adaptation points when under stress but surviving. 
                When enough points are gathered, they evolve to the next stage with new traits.
              </p>
              <ul className="text-xs space-y-1 list-disc pl-4">
                <li>Stage 1: Basic organism</li>
                <li>Stage 2: Adapted organism with improved traits</li>
                <li>Stage 3: Highly evolved organism with multiple beneficial traits</li>
              </ul>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <ScrollArea className="h-64 pr-2">
        <div className="space-y-3">
          {Object.entries(organizedOrganisms).map(([key, orgs]) => {
            const [type, stageStr] = key.split("-");
            const stage = parseInt(stageStr);
            const evolutionInfo = getEvolutionInfo(type, stage);
            const nextEvolutionInfo = getEvolutionInfo(type, stage + 1);
            
            // Example organism to show stats
            const exampleOrg = orgs[0];
            const isMaxEvolution = stage >= 2; // Assuming max stage is 2
            
            // Calculate progress to next evolution
            let progressPercent = 0;
            if (!isMaxEvolution && nextEvolutionInfo.threshold > 0) {
              progressPercent = (exampleOrg.adaptationPoints / nextEvolutionInfo.threshold) * 100;
            }

            return (
              <div key={key} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{evolutionInfo.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold">{evolutionInfo.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Count: {orgs.length}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                    Stage {stage + 1}/3
                  </div>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex flex-wrap gap-1 mb-1">
                    {evolutionInfo.traits.map((trait, index) => (
                      <span 
                        key={`${trait}-${index}`} 
                        className="text-xs bg-green-100 dark:bg-green-900 px-1.5 py-0.5 rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic mb-2">
                    "{evolutionInfo.description}"
                  </p>

                  {!isMaxEvolution && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center">
                          <span>Next: {nextEvolutionInfo.name}</span>
                          <ChevronRight className="h-3 w-3 mx-1" />
                          <span className="text-lg">{nextEvolutionInfo.icon}</span>
                        </div>
                        <span>{Math.round(exampleOrg.adaptationPoints)}/{nextEvolutionInfo.threshold} pts</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                      
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">New traits:</span>
                        {nextEvolutionInfo.traits
                          .filter(trait => !evolutionInfo.traits.includes(trait))
                          .map((trait, index) => (
                            <span 
                              key={`${trait}-next-${index}`} 
                              className="text-xs bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded-full"
                            >
                              {trait}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {isMaxEvolution && (
                    <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
                      Maximum evolution achieved
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {Object.keys(organizedOrganisms).length === 0 && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-2">
              No organisms in the ecosystem yet.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EvolutionPanel;
