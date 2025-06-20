
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowGuest?: boolean;
}

export const ProtectedRoute = ({ children, allowGuest = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Show a loading indicator while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }
  
  // Detect booking paths and waitlist joining paths comprehensively
  const isBookingPath = 
    location.pathname.includes('/booking') || 
    location.pathname.includes('/book') || 
    location.pathname.startsWith('/customer/book') || 
    location.pathname === '/customer/book-appointment' ||
    location.pathname.includes('/book-appointment') ||
    location.pathname === '/customer/patient-booking' ||
    location.pathname.includes('/patient-booking'); // Add patient booking path
  
  const isWaitlistPath = 
    location.pathname.includes('/join-waitlist') ||
    location.pathname.includes('/waitlist/join');
  
  console.log(`Path: ${location.pathname}, isBookingPath: ${isBookingPath}, isWaitlistPath: ${isWaitlistPath}, allowGuest: ${allowGuest}`);
  
  // If we're on a booking path or waitlist joining path and allowGuest is true, allow access regardless of auth status
  if ((isBookingPath || isWaitlistPath) && allowGuest) {
    console.log("Guest access allowed for booking/waitlist page");
    return <>{children}</>;
  }
  
  // If not signed in and guest access is not allowed, redirect to sign-in with return path
  if (!user) {
    const returnPath = location.pathname + location.search; // Include search params for QR code scans
    const fromBooking = isBookingPath ? 'booking' : '';
    console.log(`User not signed in and guest access not allowed, redirecting to signin with returnTo=${returnPath}`);
    return <Navigate to={`/signin?from=${fromBooking}&returnTo=${encodeURIComponent(returnPath)}`} replace />;
  }

  // User is authenticated, render the children
  return <>{children}</>;
};
