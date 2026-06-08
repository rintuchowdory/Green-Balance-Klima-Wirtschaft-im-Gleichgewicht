import { useGetConflicts } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import { Map, Leaf, TrendingDown, AlertTriangle } from "lucide-react";

export default function KonfliktAtlas() {
  const { data: conflicts, isLoading } = useGetConflicts();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium': return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
      case 'low': return 'bg-chart-1/20 text-chart-1 border-chart-1/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityHex = (severity: string) => {
    switch (severity) {
      case 'high': return 'hsl(var(--destructive))';
      case 'medium': return 'hsl(var(--chart-4))';
      case 'low': return 'hsl(var(--chart-1))';
      default: return 'hsl(var(--muted))';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded-md shadow-md max-w-[250px]">
          <p className="font-bold text-sm mb-1">{data.title}</p>
          <div className="text-xs space-y-1">
            <p><span className="text-muted-foreground">Klimanutzen:</span> <span className="font-medium text-chart-1">{data.climateScore}/10</span></p>
            <p><span className="text-muted-foreground">Wirtschaftliche Kosten:</span> <span className="font-medium text-destructive">{data.economyScore}/10</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight flex items-center gap-3">
          <Map className="w-8 h-8 text-primary" />
          Konflikt-Atlas
        </h1>
        <p className="text-muted-foreground text-lg">Kartierung der realen Trade-offs zwischen Klimaschutz und ökonomischer Belastung.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Trade-off Matrix</CardTitle>
              <CardDescription>Y-Achse: Klimanutzen (1-10) • X-Achse: Wirtschaftliche Kosten (1-10)</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="w-full h-[500px]" />
              ) : (
                <div className="h-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        type="number" 
                        dataKey="economyScore" 
                        name="Wirtschaftliche Kosten" 
                        domain={[0, 10]} 
                        stroke="hsl(var(--muted-foreground))"
                        label={{ value: 'Wirtschaftliche Belastung →', position: 'bottom', fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="climateScore" 
                        name="Klimanutzen" 
                        domain={[0, 10]} 
                        stroke="hsl(var(--muted-foreground))"
                        label={{ value: 'Klimanutzen →', angle: -90, position: 'left', fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
                      <Scatter name="Konflikte" data={conflicts} fill="hsl(var(--primary))">
                        {conflicts?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getSeverityHex(entry.severity)} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] hide-scrollbar pr-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))
          ) : conflicts?.map((topic, i) => (
            <motion.div 
              key={topic.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <Badge variant="outline" className={getSeverityColor(topic.severity)}>
                      {topic.severity === 'high' ? 'Hoch' : topic.severity === 'medium' ? 'Mittel' : 'Niedrig'}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{topic.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Leaf className="w-4 h-4 text-chart-1 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{topic.climateEffect}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <TrendingDown className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{topic.economyEffect}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex gap-4 text-xs font-medium">
                  <div className="bg-secondary/50 px-2 py-1 rounded-md text-secondary-foreground">
                    Klima-Score: {topic.climateScore}/10
                  </div>
                  <div className="bg-destructive/10 px-2 py-1 rounded-md text-destructive">
                    Kosten-Score: {topic.economyScore}/10
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}