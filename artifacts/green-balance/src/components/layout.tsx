import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { 
  BarChart3, 
  Map, 
  Globe, 
  MessageSquare, 
  MessagesSquare, 
  Sliders, 
  Leaf 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Übersicht", icon: Leaf },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/konflikt-atlas", label: "Konflikt-Atlas", icon: Map },
  { href: "/bundeslaender", label: "Bundesländer", icon: Globe },
  { href: "/meinungen", label: "Meinungen", icon: MessageSquare },
  { href: "/debatte", label: "Debatte", icon: MessagesSquare },
  { href: "/simulator", label: "Simulator", icon: Sliders },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <nav className="w-full md:w-64 lg:w-72 flex-shrink-0 border-b md:border-b-0 md:border-r border-border bg-card/50 backdrop-blur sticky top-0 md:static z-50">
        <div className="p-4 md:p-6 flex flex-row md:flex-col h-full overflow-x-auto md:overflow-y-auto hide-scrollbar items-center md:items-start gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-3 shrink-0 mr-4 md:mr-0 text-primary">
            <Leaf className="w-8 h-8 md:w-10 md:h-10" />
            <div>
              <h1 className="font-serif font-bold text-lg md:text-2xl leading-none tracking-tight">Green Balance</h1>
              <p className="text-xs text-muted-foreground hidden md:block mt-1">Klima & Wirtschaft</p>
            </div>
          </Link>
          
          <div className="flex flex-row md:flex-col gap-2 w-full">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex-shrink-0 w-auto md:w-full">
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors cursor-pointer group whitespace-nowrap md:whitespace-normal text-sm md:text-base",
                    isActive 
                      ? "bg-secondary text-secondary-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}>
                    <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      <main className="flex-1 overflow-x-hidden relative">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
