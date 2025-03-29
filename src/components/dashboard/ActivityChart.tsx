
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Users, Clock, Calendar } from "lucide-react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { useState } from "react";

// Demo data
const dailyData = [
  { time: '9AM', waitlist: 5, appointments: 3 },
  { time: '10AM', waitlist: 12, appointments: 6 },
  { time: '11AM', waitlist: 18, appointments: 8 },
  { time: '12PM', waitlist: 22, appointments: 10 },
  { time: '1PM', waitlist: 15, appointments: 12 },
  { time: '2PM', waitlist: 10, appointments: 8 },
  { time: '3PM', waitlist: 8, appointments: 5 },
  { time: '4PM', waitlist: 14, appointments: 7 },
  { time: '5PM', waitlist: 18, appointments: 4 },
];

const weeklyData = [
  { time: 'Mon', waitlist: 35, appointments: 22 },
  { time: 'Tue', waitlist: 45, appointments: 28 },
  { time: 'Wed', waitlist: 40, appointments: 30 },
  { time: 'Thu', waitlist: 55, appointments: 35 },
  { time: 'Fri', waitlist: 60, appointments: 40 },
  { time: 'Sat', waitlist: 75, appointments: 45 },
  { time: 'Sun', waitlist: 45, appointments: 25 },
];

const monthlyData = [
  { time: 'Jan', waitlist: 120, appointments: 80 },
  { time: 'Feb', waitlist: 140, appointments: 90 },
  { time: 'Mar', waitlist: 160, appointments: 110 },
  { time: 'Apr', waitlist: 180, appointments: 130 },
  { time: 'May', waitlist: 200, appointments: 150 },
  { time: 'Jun', waitlist: 220, appointments: 170 },
  { time: 'Jul', waitlist: 240, appointments: 190 },
];

export function ActivityChart() {
  const [timeFrame, setTimeFrame] = useState('daily');
  
  const data = timeFrame === 'daily' 
    ? dailyData 
    : timeFrame === 'weekly' 
      ? weeklyData 
      : monthlyData;

  return (
    <BlurCard className="col-span-full h-full">
      <BlurCardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          <BlurCardTitle className="text-base sm:text-lg">Activity Overview</BlurCardTitle>
        </div>
        <Select defaultValue="daily" onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[120px] bg-muted/50 border-0">
            <SelectValue placeholder="Daily" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </BlurCardHeader>
      <BlurCardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="waitlistGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="appointmentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                stroke="#64748B" 
                fontSize={12}
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
                itemStyle={{ color: '#E2E8F0' }}
                labelStyle={{ color: '#E2E8F0', fontWeight: 'bold', marginBottom: '0.5rem' }}
              />
              <Area
                type="monotone"
                dataKey="waitlist"
                stroke="#8B5CF6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#waitlistGradient)"
                name="Waitlist Entries"
              />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#appointmentsGradient)"
                name="Appointments"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span className="text-xs text-muted-foreground">Waitlist</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-secondary"></div>
            <span className="text-xs text-muted-foreground">Appointments</span>
          </div>
        </div>
      </BlurCardContent>
    </BlurCard>
  );
}
