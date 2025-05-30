import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient } from 'react-query';

// Import components
import Layout from '@/components/Layout';
import CustomerLayout from '@/components/CustomerLayout';
import Landing from '@/pages/Landing';
import Pricing from '@/pages/Pricing';
import IndustryFeatures from '@/pages/IndustryFeatures';
import Contact from '@/pages/Contact';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import BusinessRegister from '@/pages/BusinessRegister';
import UserRegister from '@/pages/UserRegister';
import Dashboard from '@/pages/Dashboard';
import Waitlist from '@/pages/Waitlist';
import WaitlistDetails from '@/pages/WaitlistDetails';
import Customers from '@/pages/Customers';
import Tables from '@/pages/Tables';
import TableReservations from '@/pages/TableReservations';
import Appointments from '@/pages/Appointments';
import PractitionersPage from '@/pages/PractitionersPage';
import PatientsPage from '@/pages/PatientsPage';
import PatientDetailsPage from '@/pages/PatientDetailsPage';
import ServicesPage from '@/pages/ServicesPage';
import Locations from '@/pages/Locations';
import StaffManagement from '@/pages/StaffManagement';
import Reports from '@/pages/Reports';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import CustomerDashboard from '@/pages/CustomerDashboard';
import CustomerWaitlists from '@/pages/CustomerWaitlists';
import CustomerAppointments from '@/pages/CustomerAppointments';
import CustomerProfile from '@/pages/CustomerProfile';
import BookAppointmentPage from '@/pages/BookAppointmentPage';
import PatientBookingPage from '@/pages/PatientBookingPage';
import JoinWaitlist from '@/pages/JoinWaitlist';
import AdminPage from '@/pages/AdminPage';
import NotFound from '@/pages/NotFound';
import CustomCursor from '@/components/CustomCursor';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';
import { AuthProvider } from '@/context/AuthContext';
import SubscriptionPage from "@/pages/SubscriptionPage";
import { SubscriptionProvider } from "@/context/SubscriptionContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <QueryClient>
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
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
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
              </Route>

              {/* Customer routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<CustomerLayout />}>
                  <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                  <Route path="/customer/waitlists" element={<CustomerWaitlists />} />
                  <Route path="/customer/appointments" element={<CustomerAppointments />} />
                  <Route path="/customer/profile" element={<CustomerProfile />} />
                </Route>
              </Route>

              {/* Booking routes (allow guest access) */}
              <Route element={<ProtectedRoute allowGuest={true} />}>
                <Route path="/customer/book-appointment" element={<BookAppointmentPage />} />
                <Route path="/customer/book/:businessId" element={<PatientBookingPage />} />
                <Route path="/join-waitlist/:waitlistId" element={<JoinWaitlist />} />
              </Route>

              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </QueryClient>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
