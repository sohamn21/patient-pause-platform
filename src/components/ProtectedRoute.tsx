
import { useUser } from "@clerk/clerk-react";
import { ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useUser();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    // Check if the auth check has completed to avoid flashing screens
    if (isLoaded) {
      setAuthCheckComplete(true);
    }
  }, [isLoaded]);

  // Handle the loading state
  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }

  // This will only happen after isLoaded is true
  if (!isSignedIn) {
    console.log("User not signed in, redirecting to signin");
    return <Navigate to="/signin" replace />;
  }

  return children;
};
