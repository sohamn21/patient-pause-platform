
import { BlurCard, BlurCardContent } from "@/components/ui/blur-card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeText?: string;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeText,
  iconColor = "bg-primary/10 text-primary",
}: StatsCardProps) {
  return (
    <BlurCard>
      <BlurCardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {change !== undefined && (
            <div className="flex items-center text-xs">
              <span
                className={cn({
                  "text-green-500": change > 0,
                  "text-red-500": change < 0,
                  "text-muted-foreground": change === 0,
                })}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              {changeText && (
                <span className="ml-1 text-muted-foreground">{changeText}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn("rounded-full p-2", iconColor)}>
          <Icon size={18} />
        </div>
      </BlurCardContent>
    </BlurCard>
  );
}
