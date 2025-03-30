
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  MessageSquare,
  Heart,
  Scissors,
  Utensils
} from 'lucide-react';

const Contact = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const businessType = profile?.business_type;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send this data to your backend
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      phone: ''
    });
  };

  // Get business-specific contact details and form fields
  const getBusinessSpecificContent = () => {
    switch(businessType) {
      case 'clinic':
        return {
          title: "Contact Our Healthcare Team",
          description: "Have a question about our medical services or need to schedule an appointment? Reach out to our healthcare team.",
          icon: <Heart className="h-8 w-8 text-primary" />,
          additionalFields: (
            <div className="space-y-4">
              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-1">
                  Service Needed
                </label>
                <select 
                  id="service" 
                  className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                  defaultValue=""
                >
                  <option value="" disabled>Select a service</option>
                  <option value="general-consultation">General Consultation</option>
                  <option value="follow-up">Follow-up Appointment</option>
                  <option value="specialized-care">Specialized Care</option>
                  <option value="wellness-check">Wellness Check</option>
                </select>
              </div>
              <div>
                <label htmlFor="preferred-date" className="block text-sm font-medium mb-1">
                  Preferred Date (Optional)
                </label>
                <Input 
                  id="preferred-date" 
                  type="date" 
                  name="preferred-date"
                />
              </div>
            </div>
          ),
          contactInfo: [
            { icon: <Phone />, text: "Emergency: +91 1800-123-4567" },
            { icon: <Clock />, text: "Open: Mon-Sat 8:00 AM - 8:00 PM" },
            { icon: <Calendar />, text: "Appointments: Book online or call us" }
          ]
        };
      case 'salon':
        return {
          title: "Book Your Styling Experience",
          description: "Ready for a new look? Have questions about our beauty services? Contact our style experts.",
          icon: <Scissors className="h-8 w-8 text-primary" />,
          additionalFields: (
            <div className="space-y-4">
              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-1">
                  Service Interested In
                </label>
                <select 
                  id="service" 
                  className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                  defaultValue=""
                >
                  <option value="" disabled>Select a service</option>
                  <option value="haircut">Haircut & Styling</option>
                  <option value="color">Hair Color</option>
                  <option value="treatment">Hair Treatment</option>
                  <option value="makeup">Makeup Services</option>
                  <option value="nail">Nail Services</option>
                </select>
              </div>
              <div>
                <label htmlFor="stylist" className="block text-sm font-medium mb-1">
                  Preferred Stylist (Optional)
                </label>
                <Input 
                  id="stylist" 
                  type="text" 
                  name="stylist"
                  placeholder="Enter stylist name if any"
                />
              </div>
            </div>
          ),
          contactInfo: [
            { icon: <Phone />, text: "Beauty Hotline: +91 1800-789-5678" },
            { icon: <Clock />, text: "Open: Tue-Sun 10:00 AM - 8:00 PM" },
            { icon: <Calendar />, text: "Walk-ins Welcome | Appointments Preferred" }
          ]
        };
      case 'restaurant':
        return {
          title: "Reservations & Inquiries",
          description: "Planning a special evening or have questions about our menu? Get in touch with our hospitality team.",
          icon: <Utensils className="h-8 w-8 text-primary" />,
          additionalFields: (
            <div className="space-y-4">
              <div>
                <label htmlFor="party-size" className="block text-sm font-medium mb-1">
                  Party Size
                </label>
                <Input 
                  id="party-size" 
                  type="number" 
                  name="party-size"
                  placeholder="Number of guests"
                  min="1"
                />
              </div>
              <div>
                <label htmlFor="reservation-date" className="block text-sm font-medium mb-1">
                  Reservation Date/Time (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    id="reservation-date" 
                    type="date" 
                    name="reservation-date"
                  />
                  <Input 
                    id="reservation-time" 
                    type="time" 
                    name="reservation-time"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="special-requests" className="block text-sm font-medium mb-1">
                  Special Requests (Optional)
                </label>
                <Textarea 
                  id="special-requests" 
                  name="special-requests"
                  placeholder="Dietary restrictions, special occasions, etc."
                  rows={3}
                />
              </div>
            </div>
          ),
          contactInfo: [
            { icon: <Phone />, text: "Reservations: +91 1800-456-7890" },
            { icon: <Clock />, text: "Dining Hours: Mon-Sun 12:00 PM - 11:00 PM" },
            { icon: <Calendar />, text: "Special Events & Catering Available" }
          ]
        };
      default:
        return {
          title: "Contact Us",
          description: "Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.",
          icon: <MessageSquare className="h-8 w-8 text-primary" />,
          additionalFields: null,
          contactInfo: [
            { icon: <Phone />, text: "Call us: +91 1800-123-4567" },
            { icon: <Clock />, text: "Business Hours: Mon-Fri 9:00 AM - 6:00 PM" },
            { icon: <Mail />, text: "Email: support@waitify.com" }
          ]
        };
    }
  };

  const content = getBusinessSpecificContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact</h1>
        <p className="text-muted-foreground">
          Get in touch with our team for support or inquiries.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {content.icon}
              <CardTitle>{content.title}</CardTitle>
            </div>
            <CardDescription>{content.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  required 
                  placeholder="How can we help?"
                />
              </div>
              
              {content.additionalFields}
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  placeholder="Your message"
                  rows={5}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Find us using the information below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                {content.contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {item.icon}
                    </div>
                    <p>{item.text}</p>
                  </div>
                ))}
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin />
                  </div>
                  <div>
                    <p>123 Business Park,</p>
                    <p>Sector 5, Salt Lake</p>
                    <p>Kolkata, West Bengal 700091</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </Button>
                </div>
              </div>
              
              {businessType && (
                <div className="border-t pt-6">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => navigate(businessType === 'restaurant' ? '/table-reservations' : '/appointments')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {businessType === 'restaurant' ? 'Make a Reservation' : 'Book an Appointment'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
