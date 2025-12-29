import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
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
// Unified Command Pages
import CommandDashboard from "./pages/command/CommandDashboard";
import MyTasks from "./pages/command/MyTasks";
import WorkflowPage from "./pages/command/WorkflowPage";
import TicketDetailPage from "./pages/command/TicketDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              {/* Client Dashboard Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/dashboard/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />
              <Route path="/dashboard/evidence" element={<ProtectedRoute><EvidencePage /></ProtectedRoute>} />
              <Route path="/dashboard/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
              <Route path="/dashboard/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminOverview /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/teams" element={<ProtectedRoute requireAdmin><TeamManagement /></ProtectedRoute>} />
              <Route path="/admin/permissions" element={<ProtectedRoute requireAdmin><WorkflowPermissions /></ProtectedRoute>} />
              <Route path="/admin/opportunities" element={<ProtectedRoute requireAdmin><OpportunityCMS /></ProtectedRoute>} />
              {/* Unified Command Routes - All staff teams */}
              <Route path="/command" element={<ProtectedRoute requireStaff><CommandDashboard /></ProtectedRoute>} />
              <Route path="/command/my-tasks" element={<ProtectedRoute requireStaff><MyTasks /></ProtectedRoute>} />
              <Route path="/command/workflows/:workflowId" element={<ProtectedRoute requireStaff><WorkflowPage /></ProtectedRoute>} />
              <Route path="/command/tickets/:ticketId" element={<ProtectedRoute requireStaff><TicketDetailPage /></ProtectedRoute>} />
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
