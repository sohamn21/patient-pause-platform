
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from '@/components/ui/blur-card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Clock, Calendar } from 'lucide-react';
import AdminRoleUpdater from '@/components/AdminRoleUpdater';

const CustomerDashboard = () => {
  const { user, profile } = useAuth();

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BlurCard>
            <BlurCardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback>
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <p className="text-muted-foreground mb-2">
                  {user?.email}
                </p>
                <Badge variant="outline" className="mt-2">
                  {profile?.role || 'customer'}
                </Badge>
              </div>
            </BlurCardContent>
          </BlurCard>
          
          {/* Admin Role Updater */}
          <div className="mt-6">
            <AdminRoleUpdater />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BlurCard>
              <BlurCardHeader>
                <BlurCardTitle>Active Waitlists</BlurCardTitle>
              </BlurCardHeader>
              <BlurCardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-primary/10 p-2 mr-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-muted-foreground text-sm">Current waitlists</p>
                  </div>
                </div>
              </BlurCardContent>
            </BlurCard>
            
            <BlurCard>
              <BlurCardHeader>
                <BlurCardTitle>Appointments</BlurCardTitle>
              </BlurCardHeader>
              <BlurCardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-primary/10 p-2 mr-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-muted-foreground text-sm">Upcoming appointments</p>
                  </div>
                </div>
              </BlurCardContent>
            </BlurCard>
          </div>
          
          <BlurCard className="mt-6">
            <BlurCardHeader>
              <BlurCardTitle>Recent Activity</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent className="p-6">
              <p className="text-muted-foreground text-center py-6">
                No recent activity to display.
              </p>
            </BlurCardContent>
          </BlurCard>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
