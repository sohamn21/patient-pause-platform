
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Clock, UserPlus, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WaitlistCardProps {
  count: number;
  capacity: number;
  avgWaitTime: number;
  location?: string;
  onAddClick?: () => void;
}

export function WaitlistCard({ count, capacity, avgWaitTime, location, onAddClick }: WaitlistCardProps) {
  const percentage = Math.min(100, Math.round((count / capacity) * 100));
  const [realTimeCount, setRealTimeCount] = useState(count);
  const [realTimePercentage, setRealTimePercentage] = useState(percentage);
  
  useEffect(() => {
    setRealTimeCount(count);
    setRealTimePercentage(percentage);
  }, [count, percentage]);

  // This is a simplified example of real-time updates
  // In a real app, you'd connect to Supabase realtime or other WebSocket service
  useEffect(() => {
    // Subscribe to waitlist entries changes
    const channel = supabase
      .channel('waitlist_updates')
      .on('broadcast', { event: 'waitlist_update' }, (payload) => {
        if (payload.payload) {
          const { newCount, newPercentage } = payload.payload as { newCount: number, newPercentage: number };
          setRealTimeCount(newCount);
          setRealTimePercentage(newPercentage);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return (
    <BlurCard>
      <BlurCardHeader className="flex flex-row items-start justify-between">
        <BlurCardTitle className="text-base sm:text-lg">
          Current Waitlist
          {location && (
            <Badge variant="outline" className="ml-2 text-xs">
              {location}
            </Badge>
          )}
        </BlurCardTitle>
        <div className="rounded-full bg-muted p-1.5 text-muted-foreground">
          <Users size={18} />
        </div>
      </BlurCardHeader>
      <BlurCardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{realTimeCount}</span>
            <span className="text-xs text-muted-foreground">of {capacity} capacity</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">Avg wait:</span>
            <span className="font-medium">{avgWaitTime} min</span>
          </div>
        </div>
        
        <Progress value={realTimePercentage} className="h-2 mb-4" />
        
        <div className="flex justify-between text-xs text-muted-foreground mb-4">
          <span>0%</span>
          <span>Capacity: {realTimePercentage}%</span>
          <span>100%</span>
        </div>
        
        <GlowButton 
          className="w-full" 
          glowColor="from-primary/40 via-primary/10 to-transparent"
          onClick={onAddClick}
        >
          <UserPlus size={16} className="mr-2" />
          Add to Waitlist
        </GlowButton>
      </BlurCardContent>
    </BlurCard>
  );
}
