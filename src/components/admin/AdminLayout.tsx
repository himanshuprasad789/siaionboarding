import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarInset,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { 
  Users, 
  Shield, 
  Sparkles, 
  LayoutDashboard,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

const adminMenuItems = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard },
  { title: 'Team Management', url: '/admin/teams', icon: Users },
  { title: 'Workflow Permissions', url: '/admin/permissions', icon: Shield },
  { title: 'Opportunity CMS', url: '/admin/opportunities', icon: Sparkles },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Command Center</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset>
          <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-4 gap-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <NavLink to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </NavLink>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
