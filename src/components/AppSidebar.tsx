
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  Utensils, 
  Users, 
  Bell, 
  LineChart, 
  MapPin, 
  Settings, 
  LogOut,
  UserCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const firstName = profile?.first_name || user?.user_metadata?.first_name || '';
  const lastName = profile?.last_name || user?.user_metadata?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const businessName = profile?.business_name || user?.user_metadata?.businessName || '';
  const avatarUrl = profile?.avatar_url || '';
  const role = profile?.role || user?.user_metadata?.role || 'customer';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const dashboardItems = [
    { 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={18} />, 
      path: '/dashboard',
      active: location.pathname === '/dashboard' 
    },
    { 
      label: 'Waitlist', 
      icon: <Clock size={18} />, 
      path: '/waitlist',
      active: location.pathname === '/waitlist' 
    },
    { 
      label: 'Appointments', 
      icon: <Calendar size={18} />, 
      path: '/appointments',
      active: location.pathname === '/appointments' 
    },
  ];

  const businessItems = role === 'business' ? [
    { 
      label: 'Tables', 
      icon: <Utensils size={18} />, 
      path: '/tables',
      active: location.pathname === '/tables' 
    },
    { 
      label: 'Customers', 
      icon: <Users size={18} />, 
      path: '/customers',
      active: location.pathname === '/customers' 
    },
    { 
      label: 'Staff', 
      icon: <UserCircle2 size={18} />, 
      path: '/staff',
      active: location.pathname === '/staff' 
    },
    { 
      label: 'Reports', 
      icon: <LineChart size={18} />, 
      path: '/reports',
      active: location.pathname === '/reports' 
    },
    { 
      label: 'Locations', 
      icon: <MapPin size={18} />, 
      path: '/locations',
      active: location.pathname === '/locations' 
    },
  ] : [];

  const systemItems = [
    { 
      label: 'Notifications', 
      icon: <Bell size={18} />, 
      path: '/notifications',
      active: location.pathname === '/notifications',
      badge: 2
    },
    { 
      label: 'Settings', 
      icon: <Settings size={18} />, 
      path: '/settings',
      active: location.pathname === '/settings' 
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center py-4">
        <h1 className="text-xl font-bold">PatientPause</h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 py-2">
            <div className="flex items-center gap-3 mb-2">
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{getInitials(fullName || 'User')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{fullName || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {role === 'business' ? businessName : 'Customer'}
                </p>
              </div>
            </div>
          </div>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    isActive={item.active}
                    onClick={() => navigate(item.path)}
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {businessItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Business</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {businessItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton 
                      isActive={item.active}
                      onClick={() => navigate(item.path)}
                      tooltip={item.label}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    isActive={item.active}
                    onClick={() => navigate(item.path)}
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <SidebarMenuBadge>
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut size={18} className="mr-2" />
          <span>Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
