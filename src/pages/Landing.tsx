
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlowButton } from '@/components/ui/glow-button';
import { CheckCircle2, Clock, Calendar, Bell, Building2, Users } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const Landing = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="py-4 px-6 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Waitify</span>
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Button>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost">
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Waitlist & Scheduling for Your Business
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Manage waitlists, appointments, and reservations in one place. Perfect for clinics, salons, and restaurants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <GlowButton size="lg">
                <Link to="/signup">Get Started</Link>
              </GlowButton>
              <Button variant="outline" size="lg">
                <Link to="/signin">Log In</Link>
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-xl">
            <div className="aspect-video bg-background/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Clock className="w-24 h-24 text-primary/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features for Every Industry</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tailored solutions for clinics, salons, and restaurants to streamline customer flow and enhance experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Waitlist</h3>
              <p className="text-muted-foreground">
                Let customers join your waitlist online or in-store and receive live updates on their position.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Appointment Scheduling</h3>
              <p className="text-muted-foreground">
                Allow customers to book appointments online, set your availability, and manage your calendar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Automated Notifications</h3>
              <p className="text-muted-foreground">
                Send SMS and email updates for waitlist position, appointments, and reservation confirmations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-location Support</h3>
              <p className="text-muted-foreground">
                Manage multiple locations with separate waitlists, staff, and settings from one dashboard.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customer Profiles</h3>
              <p className="text-muted-foreground">
                Create customer profiles with visit history, preferences, and quick rebooking options.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Industry-Specific Tools</h3>
              <p className="text-muted-foreground">
                Custom features for clinics, salons, and restaurants to match your specific business needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Sections */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tailored for Your Industry</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the solution that's right for your business type.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Clinic Section */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-8 rounded-xl border border-border">
              <h3 className="text-2xl font-bold mb-4">For Clinics</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <span>Service-based scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <span>Patient records management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <span>HIPAA-compliant data handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <span>Practitioner preferences</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                <Link to="/register/business?type=clinic">Get Started</Link>
              </Button>
            </div>

            {/* Salon Section */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-8 rounded-xl border border-border">
              <h3 className="text-2xl font-bold mb-4">For Salons</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Stylist selection & scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Service duration management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Client preferences & history</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Special event bookings</span>
                </li>
              </ul>
              <Button className="w-full bg-purple-500 hover:bg-purple-600">
                <Link to="/register/business?type=salon">Get Started</Link>
              </Button>
            </div>

            {/* Restaurant Section */}
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-8 rounded-xl border border-border">
              <h3 className="text-2xl font-bold mb-4">For Restaurants</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <span>Table management system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <span>Group reservations & party bookings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <span>Walk-in & reserved seating</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <span>POS & ordering integrations</span>
                </li>
              </ul>
              <Button className="w-full bg-amber-500 hover:bg-amber-600">
                <Link to="/register/business?type=restaurant">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Business?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of businesses using Waitify to manage their waitlists, appointments, and reservations.
          </p>
          <GlowButton size="lg">
            <Link to="/signup">Get Started for Free</Link>
          </GlowButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-bold">Waitify</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Waitify. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
