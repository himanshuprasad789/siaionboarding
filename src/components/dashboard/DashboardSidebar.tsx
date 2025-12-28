import { Home, ClipboardList, Archive, Compass, MessageSquare, FileText, LogOut } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfiles';
import { Button } from '@/components/ui/button';

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
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const collapsed = state === 'collapsed';

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = profile?.email || user?.email || '';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

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
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {displayEmail}
              </p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-full h-9 text-muted-foreground hover:text-destructive"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}