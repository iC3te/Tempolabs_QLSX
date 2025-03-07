import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { cn } from "@/lib/utils";

interface LayoutProps {
  className?: string;
  defaultSidebarOpen?: boolean;
}

const Layout = ({ className, defaultSidebarOpen = true }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // This would be updated when navigation occurs
  const updateCurrentPage = (title: string) => {
    setCurrentPage(title);
  };

  return (
    <div className={cn("flex h-screen bg-background", className)}>
      {/* Sidebar - hidden on mobile when closed */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar activePath="/" className="h-full" />
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={currentPage} onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
