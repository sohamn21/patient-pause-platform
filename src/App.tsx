
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/Landing';
import SignInPage from './pages/auth/SignIn';
import SignUpPage from './pages/auth/SignUp';
import UserRegisterPage from './pages/auth/UserRegister';
import BusinessRegisterPage from './pages/auth/BusinessRegister';
import PricingPage from './pages/Pricing';
import DashboardPage from './pages/Dashboard';
import WaitlistPage from './pages/Waitlist';
import WaitlistDetails from './pages/WaitlistDetails';
import AppointmentsPage from './pages/Appointments';
import TablesPage from './pages/Tables';
import CustomersPage from './pages/Customers';
import ReportsPage from './pages/Reports';
import LocationsPage from './pages/Locations';
import NotificationsPage from './pages/Notifications';
import SettingsPage from './pages/Settings';
import ContactPage from './pages/Contact';
import IndustryFeaturesPage from './pages/IndustryFeatures';
import NotFoundPage from './pages/NotFound';
import StaffManagementPage from "./pages/StaffManagement";
import Layout from './components/Layout';
import CustomerLayout from './components/CustomerLayout';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerWaitlists from './pages/customer/CustomerWaitlists';
import CustomerAppointments from './pages/customer/CustomerAppointments';
import { ProtectedRoute } from './components/ProtectedRoute';
import CustomCursor from './components/CustomCursor';
import JoinWaitlist from './pages/JoinWaitlist';
import AdminPage from './pages/AdminPage';
import AdminRoute from './components/AdminRoute';
import TableReservationsPage from './pages/TableReservations';
import PatientsPage from './pages/clinic/PatientsPage';
import PatientDetailsPage from './pages/clinic/PatientDetailsPage';
import ServicesPage from './pages/clinic/ServicesPage';
import PractitionersPage from './pages/clinic/PractitionersPage';
import PatientBookingPage from './pages/customer/PatientBookingPage';
import BookAppointmentPage from './pages/customer/BookAppointmentPage';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

// Separate component to fix the React hooks issue
function AppContent() {
  return (
    <AuthProvider>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/user-register" element={<UserRegisterPage />} />
        <Route path="/register/user" element={<UserRegisterPage />} />
        <Route path="/business-register" element={<BusinessRegisterPage />} />
        <Route path="/register/business" element={<BusinessRegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/join-waitlist" element={<JoinWaitlist />} />
        <Route path="/join-waitlist/:waitlistId" element={<JoinWaitlist />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        
        {/* Business routes */}
        <Route path="" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/waitlist/:waitlistId" element={<WaitlistDetails />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/table-reservations" element={<TableReservationsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/staff" element={<StaffManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/industry-features" element={<IndustryFeaturesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Clinic specific routes */}
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:patientId" element={<PatientDetailsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/practitioners" element={<PractitionersPage />} />
        </Route>
        
        {/* Customer routes */}
        <Route path="/customer" element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="waitlists" element={<CustomerWaitlists />} />
          <Route path="appointments" element={<CustomerAppointments />} />
          <Route path="book" element={<PatientBookingPage />} />
          <Route path="book/:businessId" element={<BookAppointmentPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
