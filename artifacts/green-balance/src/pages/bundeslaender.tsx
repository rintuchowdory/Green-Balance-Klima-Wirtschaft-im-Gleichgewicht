import { useGetStates } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Globe, Wind, Factory, Zap, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Bundeslaender() {
  const { data: states, isLoading } = useGetStates();

  const maxWind = states ? Math.max(...states.map(s => s.windCapacityMw)) : 0;
  const maxCo2 = states ? Math.max(...states.map(s => s.co2PerCapita)) : 0;

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight flex items-center gap-3">
          <Globe className="w-8 h-8 text-primary" />
          Bundesländer Vergleich
        </h1>
        <p className="text-muted-foreground text-lg">Regionale Unterschiede in Energieerzeugung, Emissionen und Industrie.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Übersicht nach Metriken</CardTitle>
          <CardDescription>Detailvergleich aller 16 Bundesländer</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-12" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Bundesland</TableHead>
                    <TableHead className="text-right font-semibold">CO₂/Kopf (t)</TableHead>
                    <TableHead className="text-right font-semibold">Erneuerbare (%)</TableHead>
                    <TableHead className="text-right font-semibold">Windkraft (MW)</TableHead>
                    <TableHead className="text-right font-semibold">Industrie (%)</TableHead>
                    <TableHead className="text-right font-semibold">Arbeitslose (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {states?.sort((a,b) => b.renewablePercent - a.renewablePercent).map((state) => (
                    <TableRow key={state.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 text-center text-xs font-mono bg-secondary/20 text-secondary-foreground rounded py-1">
                            {state.code}
                          </div>
                          {state.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span>{state.co2PerCapita.toFixed(1)}</span>
                          <Progress value={(state.co2PerCapita / maxCo2) * 100} className="w-16 h-1 bg-muted [&>div]:bg-destructive" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-chart-1 font-medium">{state.renewablePercent}%</span>
                          <Progress value={state.renewablePercent} className="w-16 h-1 bg-muted [&>div]:bg-chart-1" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span>{state.windCapacityMw.toLocaleString('de-DE')}</span>
                          <Progress value={(state.windCapacityMw / maxWind) * 100} className="w-16 h-1 bg-muted [&>div]:bg-chart-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{state.industryShare}%</TableCell>
                      <TableCell className="text-right text-muted-foreground">{state.unemploymentRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wind className="w-5 h-5 text-primary" />
              Nord-Süd Gefälle
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Die nördlichen Bundesländer dominieren bei der Windkraftkapazität und haben deutlich höhere Anteile erneuerbarer Energien im Strommix.
          </CardContent>
        </Card>
        
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Factory className="w-5 h-5 text-destructive" />
              Industriezentren
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Stark industrialisierte Länder weisen oft höhere CO₂-Emissionen pro Kopf auf, was den direkten Zielkonflikt zwischen Wirtschaft und Klima zeigt.
          </CardContent>
        </Card>
        
        <Card className="bg-chart-4/5 border-chart-4/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-chart-4" />
              Soziale Aspekte
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Strukturwandel trifft Regionen mit traditionell hoher Arbeitslosigkeit oft härter, was den Kohleausstieg dort politisch sensibler macht.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}