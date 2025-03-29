
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
  CheckCircle,
  Building,
  Utensils,
  Scissors,
  Stethoscope
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      title: 'Smart Waitlist',
      description: 'Reduce wait times and improve customer experience with a digital waitlist system.',
      icon: <Clock className="w-12 h-12 text-primary" />
    },
    {
      title: 'Appointment Scheduling',
      description: 'Allow customers to book appointments online and reduce no-shows with reminders.',
      icon: <CalendarClock className="w-12 h-12 text-primary" />
    },
    {
      title: 'Customer Management',
      description: 'Keep track of customer preferences and history to provide personalized service.',
      icon: <Users className="w-12 h-12 text-primary" />
    },
    {
      title: 'Notifications',
      description: 'Send automatic updates to customers via SMS, email, or in-app notifications.',
      icon: <MessageSquare className="w-12 h-12 text-primary" />
    }
  ];

  const businessTypes = [
    {
      type: 'Restaurants',
      description: 'Manage table turnover, reduce wait times, and improve customer satisfaction.',
      icon: <Utensils className="w-10 h-10 text-primary" />
    },
    {
      type: 'Salons',
      description: 'Schedule appointments, manage stylists, and keep clients informed about wait times.',
      icon: <Scissors className="w-10 h-10 text-primary" />
    },
    {
      type: 'Clinics',
      description: 'Organize patient flow, reduce waiting room congestion, and improve patient experience.',
      icon: <Stethoscope className="w-10 h-10 text-primary" />
    },
    {
      type: 'Any Service Business',
      description: 'Perfect for any business that deals with customer queues and appointments.',
      icon: <Building className="w-10 h-10 text-primary" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">PatientPause</span>
          </div>
          
          <div className="flex items-center gap-4">
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
              PatientPause helps businesses manage customer queues, reduce wait times, and improve service. Perfect for restaurants, salons, clinics, and more.
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
          <div className="relative h-[350px] w-[350px] sm:h-[500px] sm:w-[500px]">
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-primary to-purple-500 opacity-20 blur-[100px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="h-32 w-32 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Everything you need to manage customer flow and enhance service quality
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business Types Section */}
      <section className="container py-12 md:py-24 bg-muted/50 rounded-lg my-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Perfect For All Business Types
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Our solution adapts to the unique needs of various service businesses
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {businessTypes.map((business, index) => (
            <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-4">
                {business.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">{business.type}</h3>
              <p className="text-muted-foreground text-center">{business.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Join the thousands of businesses improving their customer experience
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-muted/30 p-6 rounded-lg border">
            <p className="italic mb-4">"PatientPause transformed our waiting room experience. Our patients love the transparency and reduced wait times."</p>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold">AC</span>
              </div>
              <div>
                <p className="font-medium">Dr. Arun Chopra</p>
                <p className="text-sm text-muted-foreground">Sunrise Medical Clinic</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg border">
            <p className="italic mb-4">"Table turnover has improved by 30% since implementing PatientPause. Our customers are happier, and we're seeing more revenue."</p>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold">PS</span>
              </div>
              <div>
                <p className="font-medium">Priya Sharma</p>
                <p className="text-sm text-muted-foreground">Spice Garden Restaurant</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg border">
            <p className="italic mb-4">"Our stylists can now focus on their clients instead of managing the waiting area. The scheduling is seamless, and we've reduced no-shows."</p>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold">KM</span>
              </div>
              <div>
                <p className="font-medium">Kavita Malhotra</p>
                <p className="text-sm text-muted-foreground">Elegance Hair Studio</p>
              </div>
            </div>
          </div>
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
      <footer className="border-t">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Product</h3>
              <Button variant="link" className="justify-start h-auto p-0">Features</Button>
              <Button variant="link" className="justify-start h-auto p-0">Pricing</Button>
              <Button variant="link" className="justify-start h-auto p-0">Integrations</Button>
              <Button variant="link" className="justify-start h-auto p-0">Updates</Button>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Resources</h3>
              <Button variant="link" className="justify-start h-auto p-0">Documentation</Button>
              <Button variant="link" className="justify-start h-auto p-0">Guides</Button>
              <Button variant="link" className="justify-start h-auto p-0">Support</Button>
              <Button variant="link" className="justify-start h-auto p-0">API</Button>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Company</h3>
              <Button variant="link" className="justify-start h-auto p-0">About</Button>
              <Button variant="link" className="justify-start h-auto p-0">Blog</Button>
              <Button variant="link" className="justify-start h-auto p-0">Careers</Button>
              <Button variant="link" className="justify-start h-auto p-0">Contact</Button>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Legal</h3>
              <Button variant="link" className="justify-start h-auto p-0">Privacy</Button>
              <Button variant="link" className="justify-start h-auto p-0">Terms</Button>
              <Button variant="link" className="justify-start h-auto p-0">Cookie Policy</Button>
              <Button variant="link" className="justify-start h-auto p-0">Licenses</Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Clock className="h-5 w-5" />
              <span className="font-bold">PatientPause</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2023 PatientPause. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
