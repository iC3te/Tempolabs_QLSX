import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Box,
  Clock,
  Gauge,
  Package,
  Truck,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  icon = <Box />,
  trend,
  color = "bg-blue-100",
}: MetricCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center mt-1">
            {trend.isPositive ? (
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MetricsGridProps {
  metrics?: MetricCardProps[];
}

const MetricsGrid = ({ metrics = [] }: MetricsGridProps) => {
  // Default metrics if none provided
  const defaultMetrics: MetricCardProps[] = [
    {
      title: "Active Orders",
      value: "24",
      icon: <Truck className="w-5 h-5 text-blue-600" />,
      trend: { value: "12% vs last week", isPositive: true },
      color: "bg-blue-100",
    },
    {
      title: "Inventory Status",
      value: "1,284 units",
      icon: <Package className="w-5 h-5 text-purple-600" />,
      trend: { value: "3% vs last month", isPositive: false },
      color: "bg-purple-100",
    },
    {
      title: "Equipment Utilization",
      value: "78%",
      icon: <Gauge className="w-5 h-5 text-green-600" />,
      trend: { value: "5% vs target", isPositive: true },
      color: "bg-green-100",
    },
    {
      title: "Average Production Time",
      value: "4.2 hours",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      trend: { value: "10% improvement", isPositive: true },
      color: "bg-amber-100",
    },
  ];

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics;

  return (
    <div className="w-full bg-white p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Key Performance Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            color={metric.color}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsGrid;
