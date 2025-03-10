import React, { useState } from "react";
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
  ChevronDown,
  ChevronRight,
  Factory,
  ClipboardList,
  UserCog,
  Cog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  className?: string;
  activePath?: string;
}

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  children?: NavigationItem[];
}

const Sidebar = ({ className, activePath = "/" }: SidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    production: true,
    system: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navigationItems: NavigationItem[] = [
    { name: "Trang chủ", path: "/", icon: <Home className="h-5 w-5" /> },
    {
      name: "Sản xuất",
      path: "/production",
      icon: <Factory className="h-5 w-5" />,
      children: [
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
          name: "Nhật ký sản xuất",
          path: "/production-log",
          icon: <ClipboardList className="h-5 w-5" />,
        },
        {
          name: "Thiết bị",
          path: "/equipment",
          icon: <Wrench className="h-5 w-5" />,
        },
      ],
    },
    {
      name: "Kho",
      path: "/inventory",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Nhân sự",
      path: "/personnel",
      icon: <UserCog className="h-5 w-5" />,
      children: [
        {
          name: "Danh sách nhân viên",
          path: "/personnel/list",
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: "Bảng chấm công",
          path: "/personnel/attendance",
          icon: <ClipboardList className="h-5 w-5" />,
        },
      ],
    },
    {
      name: "Hệ thống",
      path: "/system",
      icon: <Cog className="h-5 w-5" />,
      children: [
        {
          name: "Cài đặt",
          path: "/settings",
          icon: <Settings className="h-5 w-5" />,
        },
        {
          name: "Quản lý cơ sở dữ liệu",
          path: "/database",
          icon: <Database className="h-5 w-5" />,
        },
      ],
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
          {navigationItems.map((item) =>
            item.children ? (
              <Collapsible
                key={item.path}
                open={openSections[item.path.replace("/", "")]}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer",
                      activePath.startsWith(item.path)
                        ? "bg-accent/50 text-accent-foreground"
                        : "text-muted-foreground",
                    )}
                    onClick={() => toggleSection(item.path.replace("/", ""))}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </div>
                    {openSections[item.path.replace("/", "")] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-8 pt-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        activePath === child.path
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {child.icon}
                      {child.name}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
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
            ),
          )}
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
