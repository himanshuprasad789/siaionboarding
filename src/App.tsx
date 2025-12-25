import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/dashboard/HomePage";
import PlanPage from "./pages/dashboard/PlanPage";
import EvidencePage from "./pages/dashboard/EvidencePage";
import MarketplacePage from "./pages/dashboard/MarketplacePage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import AdminOverview from "./pages/admin/AdminOverview";
import TeamManagement from "./pages/admin/TeamManagement";
import WorkflowPermissions from "./pages/admin/WorkflowPermissions";
import OpportunityCMS from "./pages/admin/OpportunityCMS";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          {/* Client Dashboard Routes */}
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/dashboard/plan" element={<PlanPage />} />
          <Route path="/dashboard/evidence" element={<EvidencePage />} />
          <Route path="/dashboard/marketplace" element={<MarketplacePage />} />
          <Route path="/dashboard/messages" element={<MessagesPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/teams" element={<TeamManagement />} />
          <Route path="/admin/permissions" element={<WorkflowPermissions />} />
          <Route path="/admin/opportunities" element={<OpportunityCMS />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
