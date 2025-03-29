
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Clock, UserPlus, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface WaitlistCardProps {
  count: number;
  capacity: number;
  avgWaitTime: number;
}

export function WaitlistCard({ count, capacity, avgWaitTime }: WaitlistCardProps) {
  const percentage = Math.min(100, Math.round((count / capacity) * 100));
  
  return (
    <BlurCard>
      <BlurCardHeader className="flex flex-row items-start justify-between">
        <BlurCardTitle className="text-base sm:text-lg">Current Waitlist</BlurCardTitle>
        <div className="rounded-full bg-muted p-1.5 text-muted-foreground">
          <Users size={18} />
        </div>
      </BlurCardHeader>
      <BlurCardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{count}</span>
            <span className="text-xs text-muted-foreground">of {capacity} capacity</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">Avg wait:</span>
            <span className="font-medium">{avgWaitTime} min</span>
          </div>
        </div>
        
        <Progress value={percentage} className="h-2 mb-4" />
        
        <div className="flex justify-between text-xs text-muted-foreground mb-4">
          <span>0%</span>
          <span>Capacity: {percentage}%</span>
          <span>100%</span>
        </div>
        
        <GlowButton className="w-full" glowColor="from-primary/40 via-primary/10 to-transparent">
          <UserPlus size={16} className="mr-2" />
          Add to Waitlist
        </GlowButton>
      </BlurCardContent>
    </BlurCard>
  );
}
