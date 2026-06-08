import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import KonfliktAtlas from "@/pages/konflikt-atlas";
import Bundeslaender from "@/pages/bundeslaender";
import Meinungen from "@/pages/meinungen";
import Debatte from "@/pages/debatte";
import Simulator from "@/pages/simulator";
import KiChat from "@/pages/ki-chat";
import { useEffect } from "react";

const queryClient = new QueryClient();

function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force dark mode for that immersive museum feel
    document.documentElement.classList.add("dark");
  }, []);

  return <>{children}</>;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/konflikt-atlas" component={KonfliktAtlas} />
        <Route path="/bundeslaender" component={Bundeslaender} />
        <Route path="/meinungen" component={Meinungen} />
        <Route path="/debatte" component={Debatte} />
        <Route path="/simulator" component={Simulator} />
        <Route path="/ki-chat" component={KiChat} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
