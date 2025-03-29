
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from 'react-router-dom';
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
  LogOut
} from "lucide-react";
import { Button } from './ui/button';

const CustomerLayout = () => {
  const { signOut, profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <Link to="/customer/dashboard" className="font-bold text-lg">Waitify</Link>
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
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 shrink-0">
          <BlurCard className="sticky top-6">
            <div className="p-2">
              <Tabs defaultValue="dashboard" orientation="vertical" className="w-full">
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
      <Toaster />
    </div>
  );
};

export default CustomerLayout;
