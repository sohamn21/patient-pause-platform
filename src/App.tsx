
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
import AppointmentsPage from './pages/Appointments';
import TablesPage from './pages/Tables';
import CustomersPage from './pages/Customers';
import ReportsPage from './pages/Reports';
import LocationsPage from './pages/Locations';
import NotificationsPage from './pages/Notifications';
import SettingsPage from './pages/Settings';
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

function App() {
  return (
    <BrowserRouter>
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
          
          {/* Business routes */}
          <Route path="" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/staff" element={<StaffManagementPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          {/* Customer routes */}
          <Route path="/customer" element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="waitlists" element={<CustomerWaitlists />} />
            <Route path="appointments" element={<CustomerAppointments />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
