
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BlurCard } from "@/components/ui/blur-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <BlurCard className="max-w-md w-full text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle size={48} className="text-destructive" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gradient">404</h1>
        <p className="text-xl mb-8">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <GlowButton asChild className="w-full">
          <a href="/">
            <Home size={16} className="mr-2" />
            Return to Dashboard
          </a>
        </GlowButton>
      </BlurCard>
    </div>
  );
};

export default NotFound;
