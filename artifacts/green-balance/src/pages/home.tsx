import { Link } from "wouter";
import { ArrowRight, Leaf, BarChart3, Map, Globe, MessageSquare, MessagesSquare, Sliders, TrendingDown, Zap, Briefcase } from "lucide-react";
import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Home() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-12 pb-16">
      <section className="flex flex-col items-center text-center space-y-6 pt-12 md:pt-24 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Leaf className="w-16 h-16 text-primary mb-4" />
        </motion.div>
        <motion.h1 
          className="text-4xl md:text-6xl font-bold font-serif tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Klima & Wirtschaft im Gleichgewicht?
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Ein datengetriebener Blick auf die realen Zielkonflikte zwischen ökologischer Notwendigkeit und ökonomischer Realität in Deutschland. Informieren, verstehen, mitgestalten.
        </motion.p>
      </section>

      <section>
        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Aktuelle Lage
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        ) : summary ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    CO₂-Emissionen
                  </CardDescription>
                  <CardTitle className="text-3xl">{summary.co2TotalMt.toLocaleString('de-DE')} Mt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${summary.co2Change < 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {summary.co2Change > 0 ? '+' : ''}{summary.co2Change}% im Vergleich zum Vorjahr
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={item}>
              <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Erneuerbare Energien
                  </CardDescription>
                  <CardTitle className="text-3xl">{summary.renewablePercent}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${summary.renewableChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {summary.renewableChange > 0 ? '+' : ''}{summary.renewableChange}% im Vergleich zum Vorjahr
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Grüne Jobs
                  </CardDescription>
                  <CardTitle className="text-3xl">{summary.greenJobs.toLocaleString('de-DE')}k</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${summary.greenJobsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {summary.greenJobsChange > 0 ? '+' : ''}{summary.greenJobsChange}% im Vergleich zum Vorjahr
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : null}
      </section>

      <section>
        <h2 className="text-2xl font-serif font-bold mb-6">Erkunden Sie die Daten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Zeitreihen zu Emissionen, Energiepreisen und Arbeitsplätzen.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/konflikt-atlas">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group">
              <CardHeader>
                <Map className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle>Konflikt-Atlas</CardTitle>
                <CardDescription>Visualisierung der Trade-offs zwischen Klimaschutz und Wirtschaft.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/bundeslaender">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group">
              <CardHeader>
                <Globe className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle>Bundesländer</CardTitle>
                <CardDescription>Regionaler Vergleich der 16 deutschen Bundesländer.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/meinungen">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group">
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle>Meinungen</CardTitle>
                <CardDescription>Live-Umfragen zu aktuellen klimapolitischen Debatten.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/debatte">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group">
              <CardHeader>
                <MessagesSquare className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle>Debatte</CardTitle>
                <CardDescription>KI-generierte Perspektiven aus verschiedenen gesellschaftlichen Rollen.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/simulator">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group border-primary/50">
              <CardHeader>
                <Sliders className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle>Simulator</CardTitle>
                <CardDescription>Finden Sie Ihren eigenen ausgewogenen Energiemix.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}