import { Home, ClipboardList, Archive, Compass, MessageSquare, User, FileText } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useOnboarding } from '@/contexts/OnboardingContext';

const menuItems = [
  { title: 'Home', url: '/dashboard', icon: Home },
  { title: 'My Plan', url: '/dashboard/plan', icon: ClipboardList },
  { title: 'Evidence Vault', url: '/dashboard/evidence', icon: Archive },
  { title: 'Opportunities', url: '/dashboard/marketplace', icon: Compass },
  { title: 'Messages', url: '/dashboard/messages', icon: MessageSquare },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { data } = useOnboarding();
  const collapsed = state === 'collapsed';

  const initials = data.essentials.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <NavLink to="/dashboard" className="flex items-center gap-3 px-2 py-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground">
              EB1 Strategy
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url === '/dashboard' && location.pathname === '/dashboard/strategy');
                
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
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/dashboard/profile'} tooltip="Profile">
              <NavLink to="/dashboard/profile" className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-sidebar-foreground">
                      {data.essentials.fullName || 'User'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {data.essentials.jobTitle || 'Profile'}
                    </span>
                  </div>
                )}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
