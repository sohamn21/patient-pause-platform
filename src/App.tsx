
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
          <Route path="/business-register" element={<BusinessRegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
