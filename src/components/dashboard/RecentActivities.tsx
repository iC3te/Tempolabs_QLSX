import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Package,
  Wrench,
  Truck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

type ActivityType =
  | "order"
  | "inventory"
  | "maintenance"
  | "shipping"
  | "alert"
  | "completion";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

interface RecentActivitiesProps {
  activities?: Activity[];
  maxHeight?: number;
  title?: string;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "order":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "inventory":
      return <Package className="h-4 w-4 text-green-500" />;
    case "maintenance":
      return <Wrench className="h-4 w-4 text-orange-500" />;
    case "shipping":
      return <Truck className="h-4 w-4 text-purple-500" />;
    case "alert":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "completion":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status?: string) => {
  if (!status) return null;

  const variants: Record<string, string> = {
    completed: "default",
    pending: "secondary",
    "in-progress": "secondary",
    delayed: "destructive",
    cancelled: "destructive",
    scheduled: "outline",
  };

  return (
    <Badge
      variant={variants[status.toLowerCase()] || "outline"}
      className="ml-2"
    >
      {status}
    </Badge>
  );
};

const RecentActivities = ({
  activities = [
    {
      id: "1",
      type: "order",
      title: "Manufacturing Order #MO-2023-001",
      description: "Started production for 500 units of Product A",
      timestamp: "2 hours ago",
      status: "In-Progress",
    },
    {
      id: "2",
      type: "inventory",
      title: "Inventory Update",
      description: "Raw material XYZ-100 stock level updated to 750kg",
      timestamp: "3 hours ago",
    },
    {
      id: "3",
      type: "maintenance",
      title: "Equipment Maintenance",
      description:
        "Scheduled maintenance completed for Injection Molding Machine #3",
      timestamp: "5 hours ago",
      status: "Completed",
    },
    {
      id: "4",
      type: "alert",
      title: "Low Stock Alert",
      description:
        "Component B-234 is below minimum threshold (15 units remaining)",
      timestamp: "6 hours ago",
      status: "Pending",
    },
    {
      id: "5",
      type: "shipping",
      title: "Shipment Dispatched",
      description: "Order #ORD-2023-089 shipped to Customer XYZ",
      timestamp: "1 day ago",
      status: "Completed",
    },
    {
      id: "6",
      type: "completion",
      title: "Production Completed",
      description:
        "Manufacturing Order #MO-2023-098 completed - 200 units of Product C",
      timestamp: "1 day ago",
      status: "Completed",
    },
    {
      id: "7",
      type: "maintenance",
      title: "Maintenance Alert",
      description: "Preventive maintenance due for Packaging Machine #2",
      timestamp: "2 days ago",
      status: "Scheduled",
    },
  ],
  maxHeight = 400,
  title = "Recent Activities",
}: RecentActivitiesProps) => {
  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          className="h-[calc(100%-2rem)]"
          style={{ maxHeight: `${maxHeight}px` }}
        >
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex-shrink-0 p-2 rounded-full bg-gray-50">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
