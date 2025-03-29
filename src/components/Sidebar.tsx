import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Menu,
  X
} from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { Badge } from './ui/badge';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

export function Sidebar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = window.innerWidth < 768;
  const [mobileView, setMobileView] = useState(isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setMobileView(mobile);
      if (!mobile) setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'Waitlist', icon: <Clock size={20} />, path: '/waitlist' },
    { label: 'Appointments', icon: <Calendar size={20} />, path: '/appointments' },
  ];

  if (role === 'business') {
    menuItems.push(
      { label: 'Tables', icon: <Utensils size={20} />, path: '/tables' },
      { label: 'Customers', icon: <Users size={20} />, path: '/customers' },
      { label: 'Reports', icon: <LineChart size={20} />, path: '/reports' },
      { label: 'Locations', icon: <MapPin size={20} />, path: '/locations' },
    );
  }

  menuItems.push(
    { label: 'Notifications', icon: <Bell size={20} />, path: '/notifications', badge: 2 },
    { label: 'Settings', icon: <Settings size={20} />, path: '/settings' }
  );

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileView) setIsOpen(false);
  };

  if (mobileView) {
    return (
      <>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>

        {isOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={toggleSidebar}>
            <div 
              className="fixed inset-y-0 left-0 w-64 bg-background border-r p-4 overflow-y-auto z-50" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <span className="text-xl font-bold">PatientPause</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    <X size={20} />
                  </Button>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar>
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>{getInitials(fullName || 'User')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{fullName || 'User'}</p>
                      <p className="text-sm text-muted-foreground">
                        {role === 'business' ? businessName : 'Customer'}
                      </p>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1 flex-1">
                  {menuItems.map((item) => (
                    <Button
                      key={item.label}
                      variant={location.pathname === item.path ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </nav>

                <Button variant="ghost" className="mt-auto mb-4 w-full justify-start" onClick={handleSignOut}>
                  <LogOut size={20} />
                  <span className="ml-2">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
      <div className="flex flex-col flex-grow border-r bg-background pt-5 overflow-y-auto">
        <div className="flex items-center justify-center h-16 flex-shrink-0 px-4">
          <h1 className="text-xl font-bold">PatientPause</h1>
        </div>
        
        <div className="px-4 mb-8 mt-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{getInitials(fullName || 'User')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{fullName || 'User'}</p>
              <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                {role === 'business' ? businessName : 'Customer'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-1 flex-1 flex flex-col">
          <nav className="flex-1 px-3 pb-4 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
          
          <div className="px-3 mb-6">
            <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut size={20} />
              <span className="ml-3">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
