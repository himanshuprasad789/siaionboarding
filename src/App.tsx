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
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              {/* Client Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/plan" element={
                <ProtectedRoute>
                  <PlanPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/evidence" element={
                <ProtectedRoute>
                  <EvidencePage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/marketplace" element={
                <ProtectedRoute>
                  <MarketplacePage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/messages" element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              {/* Admin Routes - require admin role */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminOverview />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/teams" element={
                <ProtectedRoute requireAdmin>
                  <TeamManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/permissions" element={
                <ProtectedRoute requireAdmin>
                  <WorkflowPermissions />
                </ProtectedRoute>
              } />
              <Route path="/admin/opportunities" element={
                <ProtectedRoute requireAdmin>
                  <OpportunityCMS />
                </ProtectedRoute>
              } />
              {/* Press Team Routes - require press or admin role */}
              <Route path="/command/press" element={
                <ProtectedRoute requiredRoles={['press', 'admin']}>
                  <PressDashboard />
                </ProtectedRoute>
              } />
              <Route path="/command/press/tasks" element={
                <ProtectedRoute requiredRoles={['press', 'admin']}>
                  <PressTasks />
                </ProtectedRoute>
              } />
              <Route path="/command/press/workflow/:workflowId" element={
                <ProtectedRoute requiredRoles={['press', 'admin']}>
                  <PressQueue />
                </ProtectedRoute>
              } />
              {/* Paper Team Routes - require paper or admin role */}
              <Route path="/command/paper" element={
                <ProtectedRoute requiredRoles={['paper', 'admin']}>
                  <PaperDashboard />
                </ProtectedRoute>
              } />
              <Route path="/command/paper/tasks" element={
                <ProtectedRoute requiredRoles={['paper', 'admin']}>
                  <PaperTasks />
                </ProtectedRoute>
              } />
              <Route path="/command/paper/workflow/:workflowId" element={
                <ProtectedRoute requiredRoles={['paper', 'admin']}>
                  <JournalQueue />
                </ProtectedRoute>
              } />
              {/* Research Team Routes - require research or admin role */}
              <Route path="/command/research" element={
                <ProtectedRoute requiredRoles={['research', 'admin']}>
                  <ResearchDashboard />
                </ProtectedRoute>
              } />
              <Route path="/command/research/tasks" element={
                <ProtectedRoute requiredRoles={['research', 'admin']}>
                  <ResearchTasks />
                </ProtectedRoute>
              } />
              <Route path="/command/research/workflow/:workflowId" element={
                <ProtectedRoute requiredRoles={['research', 'admin']}>
                  <SalaryAnalysis />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
