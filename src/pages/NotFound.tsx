
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BlurCard } from "@/components/ui/blur-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <BlurCard className="max-w-md w-full text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle size={48} className="text-destructive" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gradient">404</h1>
        <p className="text-xl mb-4">Oops! Page not found</p>
        <p className="text-muted-foreground mb-6">
          The page "{location.pathname}" might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={goBack} className="mb-3 sm:mb-0">
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
          <GlowButton>
            <a href="/" className="flex items-center justify-center w-full">
              <Home size={16} className="mr-2" />
              Return to Home
            </a>
          </GlowButton>
        </div>
      </BlurCard>
    </div>
  );
};

export default NotFound;
