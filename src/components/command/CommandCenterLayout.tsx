import { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, ClipboardList, Newspaper, Users, FileText, BookOpen, 
  Search, DollarSign, Compass, Settings, LogOut, ChevronRight
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
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/RoleContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

// Role-specific menu configurations
const roleMenus: Record<string, MenuGroup[]> = {
  press: [
    {
      label: 'Overview',
      items: [
        { title: 'Dashboard', url: '/command/press', icon: Home },
        { title: 'My Tasks', url: '/command/press/tasks', icon: ClipboardList },
      ],
    },
    {
      label: 'Workflows',
      items: [
        { title: 'Press Queue', url: '/command/press/queue', icon: Newspaper },
        { title: 'Vendor Management', url: '/command/press/vendor', icon: Users },
      ],
    },
  ],
  paper: [
    {
      label: 'Overview',
      items: [
        { title: 'Dashboard', url: '/command/paper', icon: Home },
        { title: 'My Tasks', url: '/command/paper/tasks', icon: ClipboardList },
      ],
    },
    {
      label: 'Workflows',
      items: [
        { title: 'Journal Queue', url: '/command/paper/journal', icon: FileText },
        { title: 'Book Queue', url: '/command/paper/book', icon: BookOpen },
      ],
    },
  ],
  research: [
    {
      label: 'Overview',
      items: [
        { title: 'Dashboard', url: '/command/research', icon: Home },
        { title: 'My Tasks', url: '/command/research/tasks', icon: ClipboardList },
      ],
    },
    {
      label: 'Workflows',
      items: [
        { title: 'Salary Analysis', url: '/command/research/salary', icon: DollarSign },
        { title: 'Opportunity CMS', url: '/command/research/opportunities', icon: Compass },
      ],
    },
  ],
  admin: [
    {
      label: 'Overview',
      items: [
        { title: 'Dashboard', url: '/admin', icon: Home },
      ],
    },
    {
      label: 'Management',
      items: [
        { title: 'Team Management', url: '/admin/teams', icon: Users },
        { title: 'Workflow Permissions', url: '/admin/permissions', icon: Settings },
        { title: 'Opportunity CMS', url: '/admin/opportunities', icon: Compass },
      ],
    },
  ],
};

function CommandSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useRole();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const role = user?.role || 'press';
  const menuGroups = roleMenus[role] || roleMenus.press;

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <NavLink to="/command" className="flex items-center gap-3 px-2 py-3">
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
