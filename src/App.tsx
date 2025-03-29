
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Waitlist from "./pages/Waitlist";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import BusinessRegister from "./pages/auth/BusinessRegister";
import UserRegister from "./pages/auth/UserRegister";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Use only the environment variable that will work in Vite
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

const App = () => {
  // If no publishable key is available, show a warning
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p>Clerk Publishable Key is missing. Please add it to your environment variables.</p>
          <p className="mt-2 text-sm">Use VITE_CLERK_PUBLISHABLE_KEY in your .env file</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        clerkJSVersion="5.56.0-snapshot.v20250312225817"
        signInUrl="/signin"
        signUpUrl="/signup"
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ClerkLoading>
              <div className="min-h-screen flex items-center justify-center">
                Loading authentication...
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/register/business" element={<BusinessRegister />} />
                <Route path="/register/user" element={<UserRegister />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/waitlist" element={<Waitlist />} />
                  <Route path="/appointments" element={<Index />} />
                  <Route path="/tables" element={<Index />} />
                  <Route path="/customers" element={<Index />} />
                  <Route path="/notifications" element={<Index />} />
                  <Route path="/reports" element={<Index />} />
                  <Route path="/locations" element={<Index />} />
                  <Route path="/settings" element={<Index />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ClerkLoaded>
          </BrowserRouter>
        </TooltipProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
};

export default App;
