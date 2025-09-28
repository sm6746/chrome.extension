import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Dashboard } from "./components/Dashboard";

const queryClient = new QueryClient();

const AppExtension = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Dashboard />
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default AppExtension;

