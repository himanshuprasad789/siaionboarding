import { ReactNode, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, ClipboardList, Settings, LogOut, Loader2, FileText
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkflowsByTeam } from '@/hooks/useWorkflows';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

function CommandSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useRole();
  const { signOut } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const role = user?.primaryRole || 'press';
  
  // Fetch workflows dynamically based on the team/role
  const { data: workflows, isLoading: workflowsLoading } = useWorkflowsByTeam(role);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const getRoleColor = () => {
    switch (role) {
      case 'press': return 'bg-teal-600';
      case 'paper': return 'bg-amber-600';
      case 'research': return 'bg-violet-600';
      case 'admin': return 'bg-rose-600';
      default: return 'bg-primary';
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'press': return 'PRD Team';
      case 'paper': return 'Publishing Team';
      case 'research': return 'Research Team';
      case 'admin': return 'Administrator';
      default: return 'Team Member';
    }
  };

  const getBaseUrl = () => {
    if (role === 'admin') return '/admin';
    return `/command/${role}`;
  };

  // Build menu groups dynamically
  const menuGroups: MenuGroup[] = useMemo(() => {
    const baseUrl = getBaseUrl();
    
    const groups: MenuGroup[] = [
      {
        label: 'Overview',
        items: [
          { title: 'Dashboard', url: baseUrl, icon: Home },
          { title: 'My Tasks', url: `${baseUrl}/tasks`, icon: ClipboardList },
        ],
      },
    ];

    // Add workflows group dynamically from database
    if (workflows && workflows.length > 0) {
      groups.push({
        label: 'Workflows',
        items: workflows.map((workflow) => ({
          title: workflow.name,
          url: `${baseUrl}/workflow/${workflow.id}`,
          icon: FileText,
        })),
      });
    }

    return groups;
  }, [role, workflows]);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <NavLink to={getBaseUrl()} className="flex items-center gap-3 px-2 py-3">
          <div className={`w-9 h-9 rounded-lg ${getRoleColor()} flex items-center justify-center flex-shrink-0`}>
            <Settings className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">
                Command Center
              </span>
              <span className="text-xs text-muted-foreground">
                {getRoleLabel()}
              </span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                        <NavLink to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        
        {workflowsLoading && (
          <SidebarGroup>
            <SidebarGroupLabel>Workflows</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile">
              <div className="flex items-center gap-3 cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={`${getRoleColor()} text-white text-sm`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium text-sidebar-foreground">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </span>
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

interface CommandCenterLayoutProps {
  children: ReactNode;
}

export function CommandCenterLayout({ children }: CommandCenterLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CommandSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-6">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default CommandCenterLayout;
