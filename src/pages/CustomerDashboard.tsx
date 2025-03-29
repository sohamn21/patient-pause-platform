
import React from 'react';
import { BlurCard } from "@/components/ui/blur-card";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user, profile } = useAuth();

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile?.first_name || 'Customer'}</h1>
            <p className="text-muted-foreground mt-1">
              Manage your reservations and appointments
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BlurCard className="relative overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">My Appointments</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                View and manage your upcoming appointments
              </p>
              <Link to="/customer/appointments">
                <Button className="w-full">
                  View Appointments
                </Button>
              </Link>
            </div>
          </BlurCard>
          
          <BlurCard className="relative overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Join Waitlists</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Add yourself to waitlists at your favorite places
              </p>
              <Link to="/customer/waitlists">
                <Button className="w-full">
                  Browse Waitlists
                </Button>
              </Link>
            </div>
          </BlurCard>
          
          <BlurCard className="relative overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">My Profile</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Update your personal information and preferences
              </p>
              <Link to="/customer/profile">
                <Button className="w-full">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </BlurCard>
        </div>
        
        <BlurCard>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Nearby Businesses</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Discover businesses around you that use Waitify
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border border-border rounded-lg p-4">
                  <h4 className="font-medium">Sample Business {item}</h4>
                  <p className="text-sm text-muted-foreground mb-3">Restaurant • 2.{item} miles away</p>
                  <Link to={`/customer/business/${item}`}>
                    <Button variant="outline" size="sm" className="w-full">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </BlurCard>
      </div>
    </div>
  );
};

export default CustomerDashboard;
