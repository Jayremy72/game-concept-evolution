
import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart4, Clock, RefreshCw, X } from "lucide-react";

interface StatPoint {
  timestamp: number;
  biomeHealth: number;
  organismCount: number;
  speciesDistribution: Record<string, number>;
  averageAdaptation: number;
  waterLevel: number;
  sunlightLevel: number;
}

interface StatsDashboardProps {
  stats: StatPoint[];
  onClose: () => void;
  clearStats: () => void;
}

const StatsDashboard = ({ stats, onClose, clearStats }: StatsDashboardProps) => {
  // Format time for chart display
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Prepare data for charts
  const prepareChartData = () => {
    return stats.map(stat => ({
      time: formatTime(stat.timestamp),
      health: stat.biomeHealth,
      organisms: stat.organismCount,
      adaptation: Math.round(stat.averageAdaptation * 10) / 10,
      water: stat.waterLevel,
      sunlight: stat.sunlightLevel,
      ...stat.speciesDistribution
    }));
  };

  const chartData = prepareChartData();

  // Get a list of all species that appear in the stats
  const getAllSpecies = () => {
    const speciesSet = new Set<string>();
    stats.forEach(stat => {
      Object.keys(stat.speciesDistribution).forEach(species => {
        speciesSet.add(species);
      });
    });
    return Array.from(speciesSet);
  };

  const allSpecies = getAllSpecies();

  // Generate a color for a species
  const getSpeciesColor = (species: string, index: number) => {
    const colors = [
      "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c",
      "#d0ed57", "#83a6ed", "#8dd1e1", "#a4506c", "#6a549e"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[90vw] h-[90vh] shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <BarChart4 className="mr-2 h-5 w-5" />
            <CardTitle>Ecosystem Statistics</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearStats}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardDescription className="px-6">
          Track the health and development of your ecosystem over time.
        </CardDescription>
        
        <CardContent className="pt-2">
          <Tabs defaultValue="overview" className="h-[calc(90vh-100px)]">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="species">Species Distribution</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="h-full">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <div className="h-72 bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <h3 className="text-sm font-medium mb-3">Ecosystem Health Over Time</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="health" 
                          name="Ecosystem Health" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-72 bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <h3 className="text-sm font-medium mb-3">Organism Population</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="organisms" 
                          name="Total Organisms" 
                          stroke="#82ca9d" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-72 bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <h3 className="text-sm font-medium mb-3">Average Adaptation Points</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="adaptation" 
                          name="Avg. Adaptation" 
                          stroke="#ffc658" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="species" className="h-full">
              <ScrollArea className="h-full pr-4">
                <div className="h-[500px] bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h3 className="text-sm font-medium mb-3">Species Population Over Time</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {allSpecies.map((species, index) => (
                        <Line 
                          key={species}
                          type="monotone" 
                          dataKey={species} 
                          name={species.charAt(0).toUpperCase() + species.slice(1)} 
                          stroke={getSpeciesColor(species, index)} 
                          activeDot={{ r: 6 }} 
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="environment" className="h-full">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <div className="h-72 bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <h3 className="text-sm font-medium mb-3">Water Level Over Time</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="water" 
                          name="Water Level" 
                          stroke="#0ea5e9" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-72 bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <h3 className="text-sm font-medium mb-3">Sunlight Level Over Time</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="sunlight" 
                          name="Sunlight Level" 
                          stroke="#eab308" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDashboard;
