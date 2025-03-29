
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  // Show a loading indicator while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }
  
  // If not signed in, redirect to the sign-in page
  if (!user) {
    console.log("User not signed in, redirecting to signin");
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated, render the children
  return <>{children}</>;
};
