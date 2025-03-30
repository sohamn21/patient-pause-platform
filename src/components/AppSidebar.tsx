
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarHeader, SidebarContent, SidebarFooter, Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut, 
  Bell, 
  Map, 
  Menu,
  TableProperties,
  Utensils,
  User,
  Stethoscope,
  Scissors,
  Heart,
  Clipboard,
  ClipboardList,
  Brush,
  Grid2X2,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const { signOut, profile } = useAuth();
  const location = useLocation();
  const businessType = profile?.business_type;
  
  // Determine business type specific menu items
  const getBusinessTypeMenu = () => {
    if (businessType === 'clinic') {
      return [
        { name: 'Patients', path: '/patients', icon: Users },
        { name: 'Practitioners', path: '/practitioners', icon: Stethoscope },
        { name: 'Services', path: '/services', icon: ClipboardList },
      ];
    } else if (businessType === 'salon') {
      return [
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Stylists', path: '/staff', icon: Scissors },
        { name: 'Services', path: '/services', icon: Brush },
      ];
    } else if (businessType === 'restaurant') {
      return [
        { name: 'Tables', path: '/tables', icon: TableProperties },
        { name: 'Reservations', path: '/table-reservations', icon: Utensils },
      ];
    } else {
      return [
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Staff', path: '/staff', icon: User },
      ];
    }
  };
  
  // Common menu items for all business types
  const commonMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Waitlist', path: '/waitlist', icon: Clock },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
  ];
  
  // Combine common menu with business type specific menu
  const menuItems = [...commonMenuItems, ...getBusinessTypeMenu()];
  
  // Additional menu items
  const secondaryMenuItems = [
    { name: 'Industry Features', path: '/industry-features', icon: Grid2X2 },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
    { name: 'Locations', path: '/locations', icon: Map },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Contact', path: '/contact', icon: MessageSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];
  
  // Get business type icon for the sidebar footer
  const getBusinessTypeIcon = () => {
    switch (businessType) {
      case 'clinic':
        return <Heart className="h-4 w-4 text-primary" />;
      case 'salon':
        return <Scissors className="h-4 w-4 text-primary" />;
      case 'restaurant':
        return <Utensils className="h-4 w-4 text-primary" />;
      default:
        return <User className="h-4 w-4 text-primary" />;
    }
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="px-5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <Link to="/dashboard" className="font-bold text-lg">Waitify</Link>
          </div>
          <div className="md:hidden">
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.path ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="mt-8">
          <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Management</h3>
          <div className="space-y-1">
            {secondaryMenuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.path ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              {getBusinessTypeIcon()}
            </div>
            <div>
              <p className="text-sm font-medium">{profile?.business_name || 'Your Business'}</p>
              <p className="text-xs text-muted-foreground">
                {businessType ? businessType.charAt(0).toUpperCase() + businessType.slice(1) : 'Business'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
