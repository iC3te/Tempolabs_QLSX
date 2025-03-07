import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Calendar,
  Wrench,
  Package,
  Clipboard,
  Truck,
} from "lucide-react";

interface QuickActionProps {
  actions?: QuickAction[];
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const QuickActions = ({ actions }: QuickActionProps) => {
  // Default actions if none provided
  const defaultActions: QuickAction[] = [
    {
      title: "New Manufacturing Order",
      description: "Create a new production order",
      icon: <PlusCircle className="h-5 w-5" />,
      onClick: () => console.log("Create new manufacturing order"),
    },
    {
      title: "Schedule Maintenance",
      description: "Plan equipment maintenance",
      icon: <Calendar className="h-5 w-5" />,
      onClick: () => console.log("Schedule maintenance"),
    },
    {
      title: "Register Equipment",
      description: "Add new equipment to inventory",
      icon: <Wrench className="h-5 w-5" />,
      onClick: () => console.log("Register equipment"),
    },
    {
      title: "Add Inventory",
      description: "Register new materials or components",
      icon: <Package className="h-5 w-5" />,
      onClick: () => console.log("Add inventory"),
    },
    {
      title: "Quality Control",
      description: "Record quality inspection results",
      icon: <Clipboard className="h-5 w-5" />,
      onClick: () => console.log("Quality control"),
    },
    {
      title: "Shipment Planning",
      description: "Schedule product shipments",
      icon: <Truck className="h-5 w-5" />,
      onClick: () => console.log("Shipment planning"),
    },
  ];

  const displayActions = actions || defaultActions;

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex flex-col items-start p-4 space-y-2 hover:bg-slate-50 transition-colors"
              onClick={action.onClick}
            >
              <div className="flex items-center space-x-2 w-full">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  {action.icon}
                </div>
                <span className="font-medium">{action.title}</span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                {action.description}
              </p>
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="ghost" size="sm">
          View All Actions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickActions;
