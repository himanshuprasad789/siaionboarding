import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import MockLogin from "./pages/MockLogin";
import HomePage from "./pages/dashboard/HomePage";
import PlanPage from "./pages/dashboard/PlanPage";
import EvidencePage from "./pages/dashboard/EvidencePage";
import MarketplacePage from "./pages/dashboard/MarketplacePage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import AdminOverview from "./pages/admin/AdminOverview";
import UserManagement from "./pages/admin/UserManagement";
import TeamManagement from "./pages/admin/TeamManagement";
import WorkflowPermissions from "./pages/admin/WorkflowPermissions";
import OpportunityCMS from "./pages/admin/OpportunityCMS";
// Press Team Pages
import PressDashboard from "./pages/command/press/PressDashboard";
import PressTasks from "./pages/command/press/PressTasks";
import PressQueue from "./pages/command/press/PressQueue";
import VendorManagement from "./pages/command/press/VendorManagement";
// Paper Team Pages
import PaperDashboard from "./pages/command/paper/PaperDashboard";
import PaperTasks from "./pages/command/paper/PaperTasks";
import JournalQueue from "./pages/command/paper/JournalQueue";
import BookQueue from "./pages/command/paper/BookQueue";
// Research Team Pages
import ResearchDashboard from "./pages/command/research/ResearchDashboard";
import ResearchTasks from "./pages/command/research/ResearchTasks";
import SalaryAnalysis from "./pages/command/research/SalaryAnalysis";
import ResearchOpportunityCMS from "./pages/command/research/OpportunityCMS";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<MockLogin />} />
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
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/teams" element={<TeamManagement />} />
            <Route path="/admin/permissions" element={<WorkflowPermissions />} />
            <Route path="/admin/opportunities" element={<OpportunityCMS />} />
            {/* Press Team Routes */}
            <Route path="/command/press" element={<PressDashboard />} />
            <Route path="/command/press/tasks" element={<PressTasks />} />
            <Route path="/command/press/queue" element={<PressQueue />} />
            <Route path="/command/press/vendor" element={<VendorManagement />} />
            {/* Paper Team Routes */}
            <Route path="/command/paper" element={<PaperDashboard />} />
            <Route path="/command/paper/tasks" element={<PaperTasks />} />
            <Route path="/command/paper/journal" element={<JournalQueue />} />
            <Route path="/command/paper/book" element={<BookQueue />} />
            {/* Research Team Routes */}
            <Route path="/command/research" element={<ResearchDashboard />} />
            <Route path="/command/research/tasks" element={<ResearchTasks />} />
            <Route path="/command/research/salary" element={<SalaryAnalysis />} />
            <Route path="/command/research/opportunities" element={<ResearchOpportunityCMS />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
