import React from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  Building2,
  CalendarCheck,
  Stethoscope,
  Heart,
  Briefcase,
  MapPin,
  UserCog,
  BarChart3,
  Bell,
  Settings,
  CreditCard,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Waitlist", href: "/waitlist" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
  { icon: UserCheck, label: "Customers", href: "/customers" },
  { icon: Building2, label: "Tables", href: "/tables" },
  { icon: CalendarCheck, label: "Reservations", href: "/table-reservations" },
  { icon: Stethoscope, label: "Practitioners", href: "/practitioners" },
  { icon: Heart, label: "Patients", href: "/patients" },
  { icon: Briefcase, label: "Services", href: "/services" },
  { icon: MapPin, label: "Locations", href: "/locations" },
  { icon: UserCog, label: "Staff", href: "/staff" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: CreditCard, label: "Subscription", href: "/subscription" }, // Added subscription link
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const AppSidebar = () => {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="space-y-2">
        {sidebarItems.map((item: SidebarItemProps) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-secondary ${
                isActive ? "bg-secondary text-primary" : "text-muted-foreground"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
