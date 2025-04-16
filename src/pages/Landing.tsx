import React from 'react';
import { Button } from '@/components/ui/button';
import { GlowButton } from '@/components/ui/glow-button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Clock,
  CalendarClock,
  Users,
  MessageSquare,
  ChevronRight,
  Building,
  Utensils,
  Scissors,
  Stethoscope,
  Menu
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from '@/components/ui/card';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      title: 'Smart Waitlist',
      description: 'Reduce wait times and improve customer experience',
      icon: <Clock className="w-10 h-10 text-primary" />
    },
    {
      title: 'Appointment Scheduling',
      description: 'Book appointments online with automatic reminders',
      icon: <CalendarClock className="w-10 h-10 text-primary" />
    },
    {
      title: 'Customer Management',
      description: 'Track customer preferences and history',
      icon: <Users className="w-10 h-10 text-primary" />
    },
    {
      title: 'Notifications',
      description: 'Automatic updates via SMS or email',
      icon: <MessageSquare className="w-10 h-10 text-primary" />
    }
  ];

  const businessTypes = [
    {
      type: 'Restaurants',
      description: 'Manage table turnover and reduce wait times',
      icon: <Utensils className="w-8 h-8 text-primary" />
    },
    {
      type: 'Salons',
      description: 'Schedule appointments and manage stylists',
      icon: <Scissors className="w-8 h-8 text-primary" />
    },
    {
      type: 'Clinics',
      description: 'Organize patient flow and improve experience',
      icon: <Stethoscope className="w-8 h-8 text-primary" />
    },
    {
      type: 'Any Service Business',
      description: 'Perfect for any business with customer queues',
      icon: <Building className="w-8 h-8 text-primary" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">Waitwise</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="link" onClick={() => navigate('/pricing')}>Pricing</Button>
            <Button variant="link">Features</Button>
            <Button variant="link">Contact</Button>
            
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => navigate('/signin')}>Login</Button>
                <GlowButton onClick={() => navigate('/signup')}>Sign Up</GlowButton>
              </div>
            )}
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-4 py-4">
                  <Button variant="link" onClick={() => navigate('/pricing')}>Pricing</Button>
                  <Button variant="link">Features</Button>
                  <Button variant="link">Contact</Button>
                  
                  {user ? (
                    <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" onClick={() => navigate('/signin')}>Login</Button>
                      <GlowButton onClick={() => navigate('/signup')}>Sign Up</GlowButton>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container grid grid-cols-1 gap-6 py-12 md:grid-cols-2 md:py-24">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Stop the Wait,<br />Start the Experience
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Waitwise helps businesses manage customer queues, reduce wait times, and improve service.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <GlowButton className="mr-4" onClick={() => navigate('/signup')}>
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </GlowButton>
            <Button variant="outline" onClick={() => navigate('/pricing')}>View Pricing</Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]">
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-primary to-purple-500 opacity-20 blur-[100px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="h-24 w-24 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Features</h2>
          <p className="mt-2 text-muted-foreground md:text-lg">
            Everything you need to manage customer flow
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Business Types Section */}
      <section className="container py-12 md:py-24 bg-muted/30 rounded-lg my-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            For All Business Types
          </h2>
          <p className="mt-2 text-muted-foreground md:text-lg">
            Our solution adapts to your unique needs
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {businessTypes.map((business, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="mb-4">
                  {business.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{business.type}</h3>
                <p className="text-muted-foreground">{business.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-24">
        <div className="bg-primary/10 rounded-lg p-8 md:p-12 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
            Ready to Transform Your Customer Experience?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-[600px]">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <GlowButton onClick={() => navigate('/signup')}>
              Get Started Free
              <ChevronRight className="ml-2 h-4 w-4" />
            </GlowButton>
            <Button variant="outline" onClick={() => navigate('/pricing')}>
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Clock className="h-5 w-5" />
              <span className="font-bold">Waitwise</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2023 Waitwise. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
