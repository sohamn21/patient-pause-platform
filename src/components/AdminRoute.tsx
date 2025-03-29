
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, profile, loading } = useAuth();
  
  // Show a loading indicator while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }
  
  // Check if the user is authenticated and has the admin role
  if (!user || !profile || profile.role !== 'admin') {
    console.log("User not admin, redirecting to signin");
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated and has admin role, render the children
  return <>{children}</>;
};

export default AdminRoute;
