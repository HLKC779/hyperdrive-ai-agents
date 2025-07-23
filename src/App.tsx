import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Agents from "./pages/Agents";
import Memory from "./pages/Memory";
import Reasoning from "./pages/Reasoning";
import Tools from "./pages/Tools";
import Knowledge from "./pages/Knowledge";
import Execution from "./pages/Execution";
import Monitoring from "./pages/Monitoring";
import MultiModal from "./pages/MultiModal";
import Security from "./pages/Security";
import Copyright from "./pages/Copyright";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/reasoning" element={<Reasoning />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/execution" element={<Execution />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/multimodal" element={<MultiModal />} />
          <Route path="/multi-modal" element={<MultiModal />} />
          <Route path="/security" element={<Security />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/copyright" element={<Copyright />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
