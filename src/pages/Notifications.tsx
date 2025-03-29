
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { Bell, CheckCheck, Clock, Search, Trash2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Define a notification data structure
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "waitlist_update" | "system" | "customer" | "appointment";
  isRead: boolean;
  createdAt: string;
}

const NotificationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();
  
  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: "1", 
      title: "New Customer Joined Waitlist", 
      message: "Michael Brown has joined your waitlist.", 
      type: "waitlist_update", 
      isRead: false, 
      createdAt: "2025-03-29T14:30:00" 
    },
    { 
      id: "2", 
      title: "Wait Time Update", 
      message: "Current waitlist average wait time is now 35 minutes.", 
      type: "system", 
      isRead: false, 
      createdAt: "2025-03-29T13:15:00" 
    },
    { 
      id: "3", 
      title: "Appointment Scheduled", 
      message: "John Smith has booked an appointment for 4:00 PM tomorrow.", 
      type: "appointment", 
      isRead: true, 
      createdAt: "2025-03-29T10:45:00" 
    },
    { 
      id: "4", 
      title: "Customer Feedback", 
      message: "Emily Johnson has left a 5-star review for your restaurant.", 
      type: "customer", 
      isRead: true, 
      createdAt: "2025-03-28T18:30:00" 
    },
    { 
      id: "5", 
      title: "Waitlist Status Change", 
      message: "Sarah Williams has been seated. Table A-2 is now occupied.", 
      type: "waitlist_update", 
      isRead: true, 
      createdAt: "2025-03-28T16:20:00" 
    },
    { 
      id: "6", 
      title: "System Update", 
      message: "PatientPause has been updated to version 2.1.0 with new features.", 
      type: "system", 
      isRead: true, 
      createdAt: "2025-03-27T09:15:00" 
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "waitlist_update":
        return <Clock size={16} className="text-blue-500" />;
      case "system":
        return <Bell size={16} className="text-purple-500" />;
      case "customer":
        return <Avatar className="h-4 w-4"><AvatarFallback>C</AvatarFallback></Avatar>;
      case "appointment":
        return <Clock size={16} className="text-green-500" />;
      default:
        return <Bell size={16} />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    // Filter by search query
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by type
    const matchesType = filterType === "all" || notification.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    
    toast({
      title: "All Notifications Marked as Read",
      description: "All notifications have been marked as read.",
    });
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    toast({
      title: "Notification Deleted",
      description: "The notification has been deleted.",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            View and manage your notifications and updates.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search notifications..."
            className="max-w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="waitlist_update">Waitlist</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="appointment">Appointment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <BlurCard>
        <BlurCardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BlurCardTitle>Your Notifications</BlurCardTitle>
            {unreadCount > 0 && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <CheckCheck size={16} className="mr-2" />
              Mark All as Read
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Filter size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>View Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("waitlist_update")}>
                  Only Waitlist Updates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("system")}>
                  Only System Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("customer")}>
                  Only Customer Updates
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Show Unread Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </BlurCardHeader>
        <BlurCardContent>
          <div className="divide-y">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`py-4 px-2 hover:bg-muted/30 rounded-md transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium ${!notification.isRead ? 'text-primary' : ''}`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <Badge variant="default" className="h-1.5 w-1.5 rounded-full p-0"></Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <Bell size={36} className="mx-auto text-muted-foreground mb-3" />
                <h3 className="font-medium text-lg">No notifications found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery || filterType !== "all" 
                    ? "Try changing your search or filter settings."
                    : "You're all caught up!"}
                </p>
              </div>
            )}
          </div>
        </BlurCardContent>
      </BlurCard>
    </div>
  );
};

export default NotificationsPage;
