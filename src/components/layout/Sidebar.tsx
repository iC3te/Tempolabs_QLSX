import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Layers,
  Package,
  ShoppingBag,
  Wrench,
  Calendar,
  BarChart2,
  Users,
  Settings,
  LogOut,
  Database,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  className?: string;
  activePath?: string;
}

const Sidebar = ({ className, activePath = "/" }: SidebarProps) => {
  const navigationItems = [
    { name: "Trang chủ", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Khuôn", path: "/molds", icon: <Layers className="h-5 w-5" /> },
    {
      name: "Linh kiện",
      path: "/components",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Sản phẩm hoàn thiện",
      path: "/products",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Thiết bị",
      path: "/equipment",
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      name: "Kế hoạch sản xuất",
      path: "/production",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Theo dõi sản xuất",
      path: "/production-tracking",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Quản lý kho",
      path: "/inventory",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Quản lý cơ sở dữ liệu",
      path: "/database",
      icon: <Database className="h-5 w-5" />,
    },
    {
      name: "Quản lý người dùng",
      path: "/users",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex h-full w-[280px] flex-col bg-background border-r",
        className,
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Manufacturing MS</h2>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                activePath === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
