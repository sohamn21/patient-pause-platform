
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
  
  // If path contains 'booking' and allowGuest is true, allow access without login
  const isBookingPath = location.pathname.includes('booking');
  
  // If not signed in, and not a guest on a booking page, redirect to sign-in
  if (!user && !(allowGuest && isBookingPath)) {
    console.log("User not signed in, redirecting to signin");
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated or is a guest on booking page, render the children
  return <>{children}</>;
};
