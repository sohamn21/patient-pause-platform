
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import CustomCursor from './CustomCursor';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <CustomCursor />
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
