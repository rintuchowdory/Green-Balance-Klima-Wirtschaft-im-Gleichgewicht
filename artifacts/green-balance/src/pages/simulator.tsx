import { useMemo, useState } from "react";
import { SlidersHorizontal, Leaf, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { SOURCES, START_MIX, DEMAND_TWH, simulate, type Mix, type MixKey } from "@/lib/simulator";

export default function Simulator() {
  const [mix, setMix] = useState<Mix>({ ...START_MIX });
  const [demand, setDemand] = useState(DEMAND_TWH);

  const result = useMemo(() => simulate(mix, demand), [mix, demand]);
  const total = Object.values(mix).reduce((sum, value) => sum + value, 0);
  const chartData = SOURCES.map((source) => ({
    name: source.label,
    anteil: Math.round((mix[source.key] / (total || 1)) * 100),
    color: source.color,
  }));

  const update = (key: MixKey, value: number) => setMix((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight flex items-center gap-3">
          <SlidersHorizontal className="w-8 h-8 text-primary" />
          Energiemix-Simulator
        </h1>
        <p className="text-muted-foreground text-lg">
          Verschieben Sie den Strommix und sehen Sie sofort, was das für Emissionen und Kosten bedeutet.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Strommix einstellen</CardTitle>
            <CardDescription>
              Die Anteile werden automatisch auf 100 Prozent normiert. Aktuell: {Math.round(total)} Prozent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {SOURCES.map((source) => (
              <div key={source.key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ background: source.color }} />
                    {source.label}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {Math.round((mix[source.key] / (total || 1)) * 100)} %
                  </span>
                </div>
                <Slider
                  value={[mix[source.key]]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => update(source.key, value)}
                  aria-label={`Anteil ${source.label}`}
                />
              </div>
            ))}

            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Stromverbrauch</span>
                <span className="text-muted-foreground tabular-nums">{demand} TWh</span>
              </div>
              <Slider
                value={[demand]}
                min={300}
                max={900}
                step={10}
                onValueChange={([value]) => setDemand(value)}
                aria-label="Stromverbrauch in Terawattstunden"
              />
            </div>

            <Button variant="outline" onClick={() => setMix({ ...START_MIX })}>
              Ausgangsmix wiederherstellen
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" /> Ergebnis
              </CardTitle>
              <CardDescription>Für {demand} TWh Strom im Jahr</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">CO₂-Intensität</div>
                  <div className="text-2xl font-bold tabular-nums">{result.intensity}</div>
                  <div className="text-xs text-muted-foreground">g CO₂-äq/kWh</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Emissionen</div>
                  <div className="text-2xl font-bold tabular-nums">{result.emissionsMt}</div>
                  <div className="text-xs text-muted-foreground">Mio. t CO₂ pro Jahr</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Erneuerbare</div>
                  <div className="text-2xl font-bold tabular-nums">{result.renewableShare} %</div>
                  <div className="text-xs text-muted-foreground">des Stroms</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Gestehungskosten</div>
                  <div className="text-2xl font-bold tabular-nums">{result.costCtPerKwh}</div>
                  <div className="text-xs text-muted-foreground">ct/kWh</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" />
                Ein so erzeugter Strommix kostet rund {result.annualCostBn} Milliarden Euro im Jahr und
                verursacht {result.emissionsMt} Millionen Tonnen CO₂. Zum Vergleich: Deutschland hat
                2023 insgesamt 673 Millionen Tonnen emittiert.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Anteile im Mix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit="%" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(value: number) => [`${value} %`, "Anteil"]}
                    />
                    <Bar dataKey="anteil" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Kennzahlen sind gerundete Durchschnittswerte (Lebenszyklus-Emissionen und Stromgestehungskosten)
        und zeigen Größenordnungen, keine belastbare Bilanz. Alles rechnet im Browser, ohne Server.
      </p>
    </div>
  );
}
