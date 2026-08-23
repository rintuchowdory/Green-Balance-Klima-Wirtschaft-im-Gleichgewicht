import { useGetCo2Data, useGetEnergyData, useGetJobsData } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart } from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: co2Data, isLoading: isLoadingCo2 } = useGetCo2Data();
  const { data: energyData, isLoading: isLoadingEnergy } = useGetEnergyData();
  const { data: jobsData, isLoading: isLoadingJobs } = useGetJobsData();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Daten Dashboard</h1>
        <p className="text-muted-foreground text-lg">Entwicklung der Kernindikatoren im zeitlichen Verlauf.</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>CO₂-Emissionen</CardTitle>
              <CardDescription>Entwicklung der Treibhausgasemissionen in Millionen Tonnen</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCo2 ? (
                <Skeleton className="w-full h-[400px]" />
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={co2Data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} name="Emissionen (Mt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Strommix & Preise</CardTitle>
              <CardDescription>Zusammenhang zwischen Erneuerbaren und Strompreis</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingEnergy ? (
                <Skeleton className="w-full h-[300px]" />
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="renewableShare" stackId="a" fill="hsl(var(--chart-1))" name="Erneuerbare (%)" />
                      <Bar yAxisId="left" dataKey="coalShare" stackId="a" fill="hsl(var(--muted))" name="Kohle (%)" />
                      <Bar yAxisId="left" dataKey="gasShare" stackId="a" fill="hsl(var(--secondary))" name="Gas (%)" />
                      <Line yAxisId="right" type="monotone" dataKey="electricityPrice" stroke="hsl(var(--chart-4))" strokeWidth={3} name="Preis (ct/kWh)" dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Arbeitsplätze im Energiesektor</CardTitle>
              <CardDescription>Transformation des Arbeitsmarktes (in Tausend)</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingJobs ? (
                <Skeleton className="w-full h-[300px]" />
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      />
                      <Legend />
                      <Bar dataKey="greenJobs" fill="hsl(var(--chart-1))" name="Grüne Jobs" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="coalJobs" fill="hsl(var(--muted))" name="Kohle" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="oilGasJobs" fill="hsl(var(--secondary))" name="Öl & Gas" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}