import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";

interface ProductionLogEntry {
  id: string;
  orderNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  startCounter: string;
  endCounter: string;
  quantity: string;
  notes: string;
  operator: string;
  supervisor: string;
  productName: string;
  machineId: string;
}

const ProductionLogTable = () => {
  // Mock data for production log entries
  const [logEntries, setLogEntries] = useState<ProductionLogEntry[]>([
    {
      id: "LOG-001",
      orderNumber: "LSX-2023-001",
      date: "2023-12-15",
      startTime: "08:00",
      endTime: "12:00",
      startCounter: "1000",
      endCounter: "1500",
      quantity: "500",
      notes: "Hoạt động bình thường",
      operator: "Nguyễn Văn B",
      supervisor: "Trần Văn C",
      productName: "Vỏ điện thoại Model A",
      machineId: "MS-001",
    },
    {
      id: "LOG-002",
      orderNumber: "LSX-2023-001",
      date: "2023-12-15",
      startTime: "13:00",
      endTime: "17:00",
      startCounter: "1500",
      endCounter: "2000",
      quantity: "500",
      notes: "Điều chỉnh nhiệt độ +5°C",
      operator: "Nguyễn Văn B",
      supervisor: "Trần Văn C",
      productName: "Vỏ điện thoại Model A",
      machineId: "MS-001",
    },
    {
      id: "LOG-003",
      orderNumber: "LSX-2023-002",
      date: "2023-12-16",
      startTime: "08:00",
      endTime: "12:00",
      startCounter: "2000",
      endCounter: "2800",
      quantity: "800",
      notes: "Hoạt động bình thường",
      operator: "Phạm Văn E",
      supervisor: "Trần Văn C",
      productName: "Hộp đựng thực phẩm",
      machineId: "MS-002",
    },
    {
      id: "LOG-004",
      orderNumber: "LSX-2023-003",
      date: "2023-12-17",
      startTime: "07:00",
      endTime: "15:00",
      startCounter: "0",
      endCounter: "2000",
      quantity: "2000",
      notes: "Hoàn thành đúng tiến độ",
      operator: "Trần Văn C",
      supervisor: "Nguyễn Văn A",
      productName: "Nắp chai nước",
      machineId: "MS-003",
    },
    {
      id: "LOG-005",
      orderNumber: "LSX-2023-004",
      date: "2023-12-10",
      startTime: "08:00",
      endTime: "12:00",
      startCounter: "0",
      endCounter: "250",
      quantity: "250",
      notes: "Gặp sự cố máy, phải dừng sản xuất",
      operator: "Lê Thị D",
      supervisor: "Nguyễn Văn A",
      productName: "Khay nhựa đựng linh kiện",
      machineId: "MS-004",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderFilter, setOrderFilter] = useState<string | null>(null);

  // Filter log entries based on search and filters
  const filteredEntries = logEntries.filter((entry) => {
    const matchesSearch =
      entry.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.operator.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrder = !orderFilter || entry.orderNumber === orderFilter;

    return matchesSearch && matchesOrder;
  });

  // Get unique order numbers for filter
  const orderNumbers = [
    ...new Set(logEntries.map((entry) => entry.orderNumber)),
  ];

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Nhật ký sản xuất</h1>
            <p className="text-muted-foreground">
              Theo dõi lịch sử sản xuất của các lệnh
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo mã lệnh, sản phẩm, người vận hành..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background w-[200px]"
                value={orderFilter || ""}
                onChange={(e) => setOrderFilter(e.target.value || null)}
              >
                <option value="">Tất cả lệnh sản xuất</option>
                {orderNumbers.map((orderNum) => (
                  <option key={orderNum} value={orderNum}>
                    {orderNum}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Production Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Nhật ký sản xuất</CardTitle>
            <CardDescription>
              Hiển thị {filteredEntries.length} bản ghi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mã lệnh</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Máy SX</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Người vận hành</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.id}</TableCell>
                      <TableCell>{entry.orderNumber}</TableCell>
                      <TableCell>{entry.productName}</TableCell>
                      <TableCell>{entry.machineId}</TableCell>
                      <TableCell>
                        {new Date(entry.date).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {entry.startTime} - {entry.endTime}
                      </TableCell>
                      <TableCell>{entry.quantity}</TableCell>
                      <TableCell>{entry.operator}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {entry.notes}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredEntries.length} / {logEntries.length} bản ghi
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProductionLogTable;
