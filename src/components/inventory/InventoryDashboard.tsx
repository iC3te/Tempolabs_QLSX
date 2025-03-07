import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Package,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Plus,
  FileText,
  Truck,
  RefreshCw,
  Search,
  Filter,
  BarChart4,
  Download,
  Printer,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  minStockLevel: number;
  unit: string;
  lastUpdated: string;
  status: "normal" | "low" | "critical";
  location: string;
}

interface InventoryDashboardProps {
  inventoryItems?: InventoryItem[];
  lowStockThreshold?: number;
  criticalStockThreshold?: number;
}

const InventoryDashboard = ({
  inventoryItems = [],
  lowStockThreshold = 30,
  criticalStockThreshold = 10,
}: InventoryDashboardProps) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showLowStockDialog, setShowLowStockDialog] = useState(false);

  // Default inventory items if none provided
  const defaultInventoryItems: InventoryItem[] = [
    {
      id: "INV-001",
      name: "Raw Plastic Pellets (Type A)",
      category: "Raw Materials",
      stockLevel: 850,
      minStockLevel: 200,
      unit: "kg",
      lastUpdated: "2023-06-15",
      status: "normal",
      location: "Warehouse A-12",
    },
    {
      id: "INV-002",
      name: "Colorant Additive (Blue)",
      category: "Additives",
      stockLevel: 25,
      minStockLevel: 30,
      unit: "kg",
      lastUpdated: "2023-06-14",
      status: "low",
      location: "Storage B-05",
    },
    {
      id: "INV-003",
      name: "Plastic Caps (Small)",
      category: "Components",
      stockLevel: 5000,
      minStockLevel: 1000,
      unit: "pcs",
      lastUpdated: "2023-06-13",
      status: "normal",
      location: "Shelf C-23",
    },
    {
      id: "INV-004",
      name: "UV Stabilizer",
      category: "Additives",
      stockLevel: 5,
      minStockLevel: 20,
      unit: "kg",
      lastUpdated: "2023-06-12",
      status: "critical",
      location: "Storage B-08",
    },
    {
      id: "INV-005",
      name: "Packaging Boxes (Medium)",
      category: "Packaging",
      stockLevel: 350,
      minStockLevel: 100,
      unit: "pcs",
      lastUpdated: "2023-06-11",
      status: "normal",
      location: "Warehouse D-15",
    },
    {
      id: "INV-006",
      name: "Plastic Granules (Type B)",
      category: "Raw Materials",
      stockLevel: 120,
      minStockLevel: 150,
      unit: "kg",
      lastUpdated: "2023-06-10",
      status: "low",
      location: "Warehouse A-14",
    },
  ];

  const items =
    inventoryItems.length > 0 ? inventoryItems : defaultInventoryItems;

  // Calculate inventory statistics
  const totalItems = items.length;
  const lowStockItems = items.filter((item) => item.status === "low").length;
  const criticalStockItems = items.filter(
    (item) => item.status === "critical",
  ).length;
  const normalStockItems = totalItems - lowStockItems - criticalStockItems;

  // Filter items based on search and category
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = ["all", ...new Set(items.map((item) => item.category))];

  // Get low stock items for alert dialog
  const alertItems = items.filter(
    (item) => item.status === "low" || item.status === "critical",
  );

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <Badge variant="default" className="bg-green-500">
            Normal
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary" className="bg-amber-500 text-white">
            Low
          </Badge>
        );
      case "critical":
        return (
          <Badge variant="destructive" className="bg-red-500">
            Critical
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStockLevelProgress = (current: number, min: number) => {
    // Calculate percentage with a minimum of 5% for visibility
    const percentage = Math.max(5, (current / (min * 3)) * 100);
    // Cap at 100%
    return Math.min(100, percentage);
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-500";
      case "low":
        return "bg-amber-500";
      case "critical":
        return "bg-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage your inventory levels
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Inventory
            </Button>
          </div>
        </div>

        {/* Inventory Alerts */}
        {alertItems.length > 0 && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Low Stock Alert</AlertTitle>
            <AlertDescription>
              {alertItems.length} items are below the recommended stock level.
              <Button
                variant="link"
                className="p-0 h-auto text-red-600"
                onClick={() => setShowLowStockDialog(true)}
              >
                View details
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Inventory Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {categories.length - 1} categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Normal Stock
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{normalStockItems}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">
                  {Math.round((normalStockItems / totalItems) * 100)}% of total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <div className="h-4 w-4 rounded-full bg-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems}</div>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-xs text-amber-500">
                  {Math.round((lowStockItems / totalItems) * 100)}% of total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Stock
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalStockItems}</div>
              <div className="flex items-center mt-1">
                <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-xs text-red-500">
                  {Math.round((criticalStockItems / totalItems) * 100)}% of
                  total
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs
          defaultValue="overview"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="list">Inventory List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Stock Level Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Normal Stock</span>
                        <span className="text-sm font-medium">
                          {normalStockItems} items
                        </span>
                      </div>
                      <Progress
                        value={(normalStockItems / totalItems) * 100}
                        className="h-2 bg-gray-200"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Low Stock</span>
                        <span className="text-sm font-medium">
                          {lowStockItems} items
                        </span>
                      </div>
                      <Progress
                        value={(lowStockItems / totalItems) * 100}
                        className="h-2 bg-gray-200"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Critical Stock</span>
                        <span className="text-sm font-medium">
                          {criticalStockItems} items
                        </span>
                      </div>
                      <Progress
                        value={(criticalStockItems / totalItems) * 100}
                        className="h-2 bg-gray-200"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Recent Inventory Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Stock Received</p>
                        <p className="text-xs text-muted-foreground">
                          Raw Plastic Pellets (Type A) - 200kg added
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Low Stock Alert</p>
                        <p className="text-xs text-muted-foreground">
                          Colorant Additive (Blue) is below threshold
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          5 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Truck className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Inventory Issued</p>
                        <p className="text-xs text-muted-foreground">
                          Plastic Caps (Small) - 500pcs to Production
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          1 day ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Activities
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Critical and Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Item
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Stock Level
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {alertItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.stockLevel} {item.unit}
                            </div>
                            <div className="text-sm text-gray-500">
                              Min: {item.minStockLevel} {item.unit}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStockStatusBadge(item.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="ghost" size="sm">
                              <Plus className="h-4 w-4 mr-1" /> Restock
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory List Tab Content */}
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Inventory Items</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="search"
                        placeholder="Search items..."
                        className="pl-8 pr-4 py-2 text-sm border rounded-md w-full md:w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Item
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Stock Level
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.id}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {item.category}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {item.location}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col space-y-1">
                                <div className="text-sm text-gray-900">
                                  {item.stockLevel} {item.unit}
                                </div>
                                <div className="w-24">
                                  <Progress
                                    value={getStockLevelProgress(
                                      item.stockLevel,
                                      item.minStockLevel,
                                    )}
                                    className={`h-1.5 ${getProgressColor(
                                      item.status,
                                    )}`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStockStatusBadge(item.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4 mr-1" /> Details
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            No inventory items found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredItems.length} of {items.length} items
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Analytics Tab Content */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Analytics</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart4 className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Analytics Module</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Detailed inventory analytics and reporting would be
                    displayed here, including usage trends, stock level history,
                    and forecasting.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Low Stock Alert Dialog */}
      <Dialog open={showLowStockDialog} onOpenChange={setShowLowStockDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Low Stock Alert</DialogTitle>
            <DialogDescription>
              The following items are below their recommended stock levels and
              need attention.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Current Stock
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Min Stock
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alertItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-sm font-medium">{item.name}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-sm">
                        {item.stockLevel} {item.unit}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-sm">
                        {item.minStockLevel} {item.unit}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {getStockStatusBadge(item.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLowStockDialog(false)}
            >
              Close
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryDashboard;
