
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import components
import Layout from '@/components/Layout';
import CustomerLayout from '@/components/CustomerLayout';
import Landing from '@/pages/Landing';
import Pricing from '@/pages/Pricing';
import IndustryFeatures from '@/pages/IndustryFeatures';
import Contact from '@/pages/Contact';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import BusinessRegister from '@/pages/auth/BusinessRegister';
import UserRegister from '@/pages/auth/UserRegister';
import Dashboard from '@/pages/Dashboard';
import Waitlist from '@/pages/Waitlist';
import WaitlistDetails from '@/pages/WaitlistDetails';
import Customers from '@/pages/Customers';
import Tables from '@/pages/Tables';
import TableReservations from '@/pages/TableReservations';
import Appointments from '@/pages/Appointments';
import PractitionersPage from '@/pages/clinic/PractitionersPage';
import PatientsPage from '@/pages/clinic/PatientsPage';
import PatientDetailsPage from '@/pages/clinic/PatientDetailsPage';
import ServicesPage from '@/pages/clinic/ServicesPage';
import Locations from '@/pages/Locations';
import StaffManagement from '@/pages/StaffManagement';
import Reports from '@/pages/Reports';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import CustomerDashboard from '@/pages/CustomerDashboard';
import CustomerWaitlists from '@/pages/customer/CustomerWaitlists';
import CustomerAppointments from '@/pages/customer/CustomerAppointments';
import CustomerProfile from '@/pages/customer/CustomerProfile';
import BookAppointmentPage from '@/pages/customer/BookAppointmentPage';
import PatientBookingPage from '@/pages/customer/PatientBookingPage';
import JoinWaitlist from '@/pages/JoinWaitlist';
import AdminPage from '@/pages/AdminPage';
import NotFound from '@/pages/NotFound';
import CustomCursor from '@/components/CustomCursor';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import { AuthProvider } from '@/context/AuthContext';
import SubscriptionPage from "@/pages/SubscriptionPage";
import { SubscriptionProvider } from "@/context/SubscriptionContext";

// Create a query client
const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <CustomCursor />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/industry-features" element={<IndustryFeatures />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signup/business" element={<BusinessRegister />} />
              <Route path="/signup/user" element={<UserRegister />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/waitlist" element={<Waitlist />} />
                <Route path="/waitlist/:id" element={<WaitlistDetails />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/table-reservations" element={<TableReservations />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/practitioners" element={<PractitionersPage />} />
                <Route path="/patients" element={<PatientsPage />} />
                <Route path="/patients/:id" element={<PatientDetailsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/staff" element={<StaffManagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
              </Route>

              {/* Customer routes */}
              <Route element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>}>
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/customer/waitlists" element={<CustomerWaitlists />} />
                <Route path="/customer/appointments" element={<CustomerAppointments />} />
                <Route path="/customer/profile" element={<CustomerProfile />} />
              </Route>

              {/* Booking routes (allow guest access) */}
              <Route element={<ProtectedRoute allowGuest={true}><div /></ProtectedRoute>}>
                <Route path="/customer/book-appointment" element={<BookAppointmentPage />} />
                <Route path="/customer/book/:businessId" element={<PatientBookingPage />} />
                <Route path="/join-waitlist/:waitlistId" element={<JoinWaitlist />} />
              </Route>

              {/* Admin routes */}
              <Route element={<AdminRoute><div /></AdminRoute>}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </QueryClientProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
