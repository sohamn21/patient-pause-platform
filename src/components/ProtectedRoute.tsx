
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
  
  // Detect booking paths more comprehensively - look for ANY booking-related path
  const isBookingPath = 
    location.pathname.includes('booking') || 
    location.pathname.includes('book') || 
    location.pathname.startsWith('/customer/book') || 
    location.pathname.includes('book-appointment') ||
    location.pathname.startsWith('/booking');
  
  console.log(`Path: ${location.pathname}, isBookingPath: ${isBookingPath}, allowGuest: ${allowGuest}, route prop allowGuest: ${allowGuest}`);
  
  // If we're on a booking path and allowGuest is true, allow access regardless of auth status
  if (isBookingPath && allowGuest) {
    console.log("Guest access allowed for booking page");
    return <>{children}</>;
  }
  
  // If not signed in and guest access is not allowed, redirect to sign-in with return path
  if (!user) {
    const returnPath = location.pathname;
    console.log(`User not signed in and guest access not allowed, redirecting to signin with return=${returnPath}`);
    return <Navigate to={`/signin?from=booking&returnTo=${encodeURIComponent(returnPath)}`} replace />;
  }

  // User is authenticated, render the children
  return <>{children}</>;
};
