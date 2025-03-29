
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
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
import CustomCursor from "./components/CustomCursor";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CustomCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
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
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
