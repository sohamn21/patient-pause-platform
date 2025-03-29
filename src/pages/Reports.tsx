
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Users, 
  Clock, 
  LineChart,
  TrendingUp,
  TrendingDown,
  ChevronDown
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart as RechartLineChart,
  Line
} from "recharts";

// Sample data for charts
const dailyData = [
  { name: "9AM", customers: 4, waitTime: 10 },
  { name: "10AM", customers: 7, waitTime: 15 },
  { name: "11AM", customers: 10, waitTime: 25 },
  { name: "12PM", customers: 15, waitTime: 35 },
  { name: "1PM", customers: 18, waitTime: 40 },
  { name: "2PM", customers: 12, waitTime: 30 },
  { name: "3PM", customers: 8, waitTime: 20 },
  { name: "4PM", customers: 6, waitTime: 15 },
  { name: "5PM", customers: 9, waitTime: 25 },
  { name: "6PM", customers: 14, waitTime: 35 },
  { name: "7PM", customers: 16, waitTime: 30 },
  { name: "8PM", customers: 12, waitTime: 25 },
  { name: "9PM", customers: 8, waitTime: 15 },
  { name: "10PM", customers: 4, waitTime: 10 },
];

const weeklyData = [
  { name: "Monday", customers: 75, waitTime: 25 },
  { name: "Tuesday", customers: 65, waitTime: 22 },
  { name: "Wednesday", customers: 80, waitTime: 28 },
  { name: "Thursday", customers: 90, waitTime: 30 },
  { name: "Friday", customers: 120, waitTime: 35 },
  { name: "Saturday", customers: 140, waitTime: 40 },
  { name: "Sunday", customers: 110, waitTime: 32 },
];

const monthlyData = [
  { name: "Jan", customers: 300, waitTime: 28 },
  { name: "Feb", customers: 320, waitTime: 30 },
  { name: "Mar", customers: 340, waitTime: 32 },
  { name: "Apr", customers: 380, waitTime: 35 },
  { name: "May", customers: 400, waitTime: 38 },
  { name: "Jun", customers: 450, waitTime: 40 },
  { name: "Jul", customers: 480, waitTime: 42 },
  { name: "Aug", customers: 460, waitTime: 41 },
  { name: "Sep", customers: 440, waitTime: 39 },
  { name: "Oct", customers: 410, waitTime: 37 },
  { name: "Nov", customers: 380, waitTime: 34 },
  { name: "Dec", customers: 420, waitTime: 36 },
];

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState("daily");
  
  // Get the appropriate data based on time range
  const getChartData = () => {
    switch (timeRange) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };
  
  const chartData = getChartData();
  
  // Calculate some statistics for summary cards
  const avgWaitTime = Math.round(
    chartData.reduce((sum, item) => sum + item.waitTime, 0) / chartData.length
  );
  
  const totalCustomers = chartData.reduce((sum, item) => sum + item.customers, 0);
  
  const compareWithPrevious = (current: number, multiplier = 1) => {
    // Mock for comparison with previous period
    const change = Math.round((Math.random() * 20 - 10) * multiplier);
    return {
      value: change,
      isPositive: change > 0
    };
  };
  
  const waitTimeChange = compareWithPrevious(avgWaitTime, -1); // Negative multiplier because lower wait time is better
  const customersChange = compareWithPrevious(totalCustomers);
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            View and analyze your business performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <h3 className="text-2xl font-bold mt-1">{totalCustomers}</h3>
              <div className="flex items-center mt-1">
                {customersChange.isPositive ? (
                  <TrendingUp size={14} className="text-green-500 mr-1" />
                ) : (
                  <TrendingDown size={14} className="text-red-500 mr-1" />
                )}
                <span className={customersChange.isPositive ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                  {customersChange.value}% vs previous
                </span>
              </div>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Users size={24} />
            </div>
          </BlurCardContent>
        </BlurCard>
        
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Average Wait Time</p>
              <h3 className="text-2xl font-bold mt-1">{avgWaitTime} min</h3>
              <div className="flex items-center mt-1">
                {waitTimeChange.isPositive ? (
                  <TrendingDown size={14} className="text-red-500 mr-1" />
                ) : (
                  <TrendingUp size={14} className="text-green-500 mr-1" />
                )}
                <span className={!waitTimeChange.isPositive ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                  {Math.abs(waitTimeChange.value)}% vs previous
                </span>
              </div>
            </div>
            <div className="rounded-full bg-secondary/10 p-3 text-secondary">
              <Clock size={24} />
            </div>
          </BlurCardContent>
        </BlurCard>
        
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Report Period</p>
              <h3 className="text-2xl font-bold mt-1 capitalize">{timeRange}</h3>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Calendar size={14} className="mr-1" />
                <span>Current Period</span>
              </div>
            </div>
            <div className="rounded-full bg-accent/10 p-3 text-accent">
              <BarChart3 size={24} />
            </div>
          </BlurCardContent>
        </BlurCard>
      </div>

      <Tabs defaultValue="customers" className="mb-6">
        <TabsList>
          <TabsTrigger value="customers">Customer Traffic</TabsTrigger>
          <TabsTrigger value="waitTime">Wait Time</TabsTrigger>
          <TabsTrigger value="combined">Combined View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Customer Traffic</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="customers" name="Customers" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="waitTime" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Average Wait Time</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartLineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="waitTime" 
                      name="Wait Time (min)" 
                      stroke="#F59E0B" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                    />
                  </RechartLineChart>
                </ResponsiveContainer>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="combined" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Combined Metrics</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="customers" name="Customers" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="waitTime" name="Wait Time (min)" stroke="#F59E0B" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
      </Tabs>

      <BlurCard>
        <BlurCardHeader className="flex flex-row items-center justify-between">
          <BlurCardTitle>Detailed Metrics</BlurCardTitle>
          <Button variant="outline" size="sm">
            See All
            <ChevronDown size={16} className="ml-2" />
          </Button>
        </BlurCardHeader>
        <BlurCardContent>
          <div className="text-center py-8 text-muted-foreground">
            Detailed metrics table would be shown here with additional data points
          </div>
        </BlurCardContent>
      </BlurCard>
    </div>
  );
};

export default ReportsPage;
