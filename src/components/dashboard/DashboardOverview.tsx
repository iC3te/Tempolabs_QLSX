import React from "react";
import MetricsGrid from "./MetricsGrid";
import RecentActivities from "./RecentActivities";
import QuickActions from "./QuickActions";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DashboardOverviewProps {
  className?: string;
}

const DashboardOverview = ({ className }: DashboardOverviewProps = {}) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full h-full gap-6 p-6 bg-slate-50",
        className,
      )}
    >
      {/* Metrics Section */}
      <MetricsGrid />

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Recent Activities */}
        <Card className="bg-white">
          <CardContent className="p-0">
            <Tabs defaultValue="activities" className="w-full h-full">
              <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
                <TabsTrigger value="activities">Recent Activities</TabsTrigger>
                <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
              </TabsList>
              <TabsContent
                value="activities"
                className="p-0 m-0 h-[calc(100%-48px)]"
              >
                <RecentActivities maxHeight={500} title="" />
              </TabsContent>
              <TabsContent value="alerts" className="p-6 m-0">
                <div className="flex flex-col gap-4">
                  <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
                    <h3 className="font-medium text-amber-800">
                      Low Stock Alert
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Component B-234 is below minimum threshold (15 units
                      remaining)
                    </p>
                  </div>
                  <div className="p-4 border rounded-md bg-red-50 border-red-200">
                    <h3 className="font-medium text-red-800">
                      Equipment Maintenance Due
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Preventive maintenance required for Injection Molding
                      Machine #2
                    </p>
                  </div>
                  <div className="p-4 border rounded-md bg-blue-50 border-blue-200">
                    <h3 className="font-medium text-blue-800">
                      Order Deadline Approaching
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Manufacturing Order #MO-2023-112 due in 2 days
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Production Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Production Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Manufacturing Order #MO-2023-001
                </span>
                <span className="text-sm text-blue-600 font-medium">
                  In Progress (65%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium">
                  Manufacturing Order #MO-2023-002
                </span>
                <span className="text-sm text-green-600 font-medium">
                  Completed (100%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium">
                  Manufacturing Order #MO-2023-003
                </span>
                <span className="text-sm text-amber-600 font-medium">
                  Pending (0%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-amber-600 h-2.5 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Equipment Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Operational</span>
                </div>
                <span className="text-sm font-medium">8 machines</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm">Maintenance</span>
                </div>
                <span className="text-sm font-medium">2 machines</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Down</span>
                </div>
                <span className="text-sm font-medium">1 machine</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <span className="text-sm">Idle</span>
                </div>
                <span className="text-sm font-medium">3 machines</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
