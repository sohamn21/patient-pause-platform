
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  Calendar, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Table,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed: boolean;
}

const SidebarItem = ({ icon, label, to, collapsed }: SidebarItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200',
        {
          'justify-center': collapsed,
          'bg-accent text-accent-foreground': isActive,
          'hover:bg-accent/50 hover:text-accent-foreground': !isActive,
        }
      )
    }
  >
    <div className="text-muted-foreground">{icon}</div>
    {!collapsed && <span>{label}</span>}
  </NavLink>
);

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar border-r border-border transition-all duration-300 ease-in-out md:relative md:translate-x-0',
          {
            'w-16': collapsed && !mobileOpen,
            '-translate-x-full': !mobileOpen && !collapsed,
            'translate-x-0': mobileOpen || !collapsed,
            'md:w-16': collapsed && !mobileOpen,
          }
        )}
      >
        {/* Logo and collapse button */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">PP</span>
              </div>
              <span className="text-lg font-bold text-gradient">
                PatientPause
              </span>
            </div>
          )}
          {collapsed && !mobileOpen && (
            <div className="flex w-full justify-center">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">PP</span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="hidden md:flex"
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </Button>
        </div>

        {/* Sidebar items */}
        <div className="flex-1 overflow-auto scrollbar-none py-4 px-3">
          <div className="space-y-1 mb-6">
            <SidebarItem
              icon={<Home size={20} />}
              label="Dashboard"
              to="/"
              collapsed={collapsed && !mobileOpen}
            />
            <SidebarItem
              icon={<Clock size={20} />}
              label="Waitlist"
              to="/waitlist"
              collapsed={collapsed && !mobileOpen}
            />
            <SidebarItem
              icon={<Calendar size={20} />}
              label="Appointments"
              to="/appointments"
              collapsed={collapsed && !mobileOpen}
            />
            <SidebarItem
              icon={<Table size={20} />}
              label="Tables"
              to="/tables"
              collapsed={collapsed && !mobileOpen}
            />
            <SidebarItem
              icon={<Users size={20} />}
              label="Customers"
              to="/customers"
              collapsed={collapsed && !mobileOpen}
            />
            <SidebarItem
              icon={<MessageSquare size={20} />}
              label="Notifications"
              to="/notifications"
              collapsed={collapsed && !mobileOpen}
            />
          </div>

          <div className="pt-4 pb-2">
            {!collapsed && (
              <p className="px-3 text-xs font-medium text-muted-foreground">
                ANALYTICS
              </p>
            )}
            <div className="mt-2 space-y-1">
              <SidebarItem
                icon={<BarChart3 size={20} />}
                label="Reports"
                to="/reports"
                collapsed={collapsed && !mobileOpen}
              />
              <SidebarItem
                icon={<Building2 size={20} />}
                label="Locations"
                to="/locations"
                collapsed={collapsed && !mobileOpen}
              />
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border p-3">
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            to="/settings"
            collapsed={collapsed && !mobileOpen}
          />
        </div>
      </div>
    </>
  );
}
