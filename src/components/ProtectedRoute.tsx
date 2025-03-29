
import { useUser } from "@clerk/clerk-react";
import { ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useUser();
  
  // Show a loading indicator while Clerk is initializing
  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }
  
  // If not signed in, redirect to the sign-in page
  if (!isSignedIn) {
    console.log("User not signed in, redirecting to signin");
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated, render the children
  return <>{children}</>;
};
