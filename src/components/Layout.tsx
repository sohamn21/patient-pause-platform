
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger, SidebarRail } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <div className="flex w-full">
          <AppSidebar />
          <SidebarRail />
          <SidebarInset className="relative flex-1 overflow-auto p-4 md:p-6 bg-background">
            <div className="absolute top-4 left-4 z-50 md:hidden">
              <SidebarTrigger />
            </div>
            <div className="container mx-auto max-w-6xl">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
};

export default Layout;
