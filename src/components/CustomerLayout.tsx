
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { BlurCard } from "@/components/ui/blur-card";
import { Link } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Clock, 
  User,
  LogOut,
  Menu
} from "lucide-react";
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const CustomerLayout = () => {
  const { signOut, profile } = useAuth();
  const location = useLocation();
  
  // Determine active tab based on current path
  const getCurrentTab = (path: string) => {
    if (path.includes('/customer/dashboard')) return 'dashboard';
    if (path.includes('/customer/appointments')) return 'appointments';
    if (path.includes('/customer/waitlists')) return 'waitlists';
    if (path.includes('/customer/profile')) return 'profile';
    return 'dashboard';
  };
  
  const activeTab = getCurrentTab(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <Link to="/customer/dashboard" className="font-bold text-lg">PatientPause</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <div className="font-medium">
                {profile?.first_name} {profile?.last_name}
              </div>
              <div className="text-muted-foreground">Customer</div>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Mobile Navigation */}
        <div className="md:hidden mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center">
                <span>Menu</span>
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="py-4">
                <div className="mb-6 pb-4 border-b">
                  <div className="font-medium text-lg">
                    {profile?.first_name} {profile?.last_name}
                  </div>
                  <div className="text-muted-foreground">Customer</div>
                </div>
                <div className="space-y-3">
                  <Link to="/customer/dashboard" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/customer/appointments" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent">
                    <Calendar className="h-5 w-5" />
                    <span>Appointments</span>
                  </Link>
                  <Link to="/customer/waitlists" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent">
                    <Clock className="h-5 w-5" />
                    <span>Waitlists</span>
                  </Link>
                  <Link to="/customer/profile" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent">
                    <User className="h-5 w-5" />
                    <span>My Profile</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block md:w-64 shrink-0">
            <BlurCard className="sticky top-24">
              <div className="p-2">
                <Tabs value={activeTab} orientation="vertical" className="w-full">
                  <TabsList className="flex flex-col h-auto bg-transparent gap-1">
                    <Link to="/customer/dashboard" className="w-full">
                      <TabsTrigger value="dashboard" className="w-full justify-start gap-2 px-3">
                        <Home className="h-4 w-4" />
                        Dashboard
                      </TabsTrigger>
                    </Link>
                    <Link to="/customer/appointments" className="w-full">
                      <TabsTrigger value="appointments" className="w-full justify-start gap-2 px-3">
                        <Calendar className="h-4 w-4" />
                        Appointments
                      </TabsTrigger>
                    </Link>
                    <Link to="/customer/waitlists" className="w-full">
                      <TabsTrigger value="waitlists" className="w-full justify-start gap-2 px-3">
                        <Clock className="h-4 w-4" />
                        Waitlists
                      </TabsTrigger>
                    </Link>
                    <Link to="/customer/profile" className="w-full">
                      <TabsTrigger value="profile" className="w-full justify-start gap-2 px-3">
                        <User className="h-4 w-4" />
                        My Profile
                      </TabsTrigger>
                    </Link>
                  </TabsList>
                </Tabs>
              </div>
            </BlurCard>
          </aside>
          
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default CustomerLayout;
