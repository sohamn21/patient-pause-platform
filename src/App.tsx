
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
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
import Pricing from "./pages/Pricing";

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
              <Route path="/pricing" element={<Pricing />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/waitlist" element={<Waitlist />} />
                <Route path="/appointments" element={<Dashboard />} />
                <Route path="/tables" element={<Dashboard />} />
                <Route path="/customers" element={<Dashboard />} />
                <Route path="/notifications" element={<Dashboard />} />
                <Route path="/reports" element={<Dashboard />} />
                <Route path="/locations" element={<Dashboard />} />
                <Route path="/settings" element={<Dashboard />} />
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
