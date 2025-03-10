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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Download,
  RefreshCw,
  Filter,
  Calendar as CalendarIcon,
  FileText,
  Search,
  Plus,
  MoreVertical,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ProductionLogEntry {
  id: string;
  date: Date;
  shift: "morning" | "afternoon" | "night";
  orderNumber: string;
  product: string;
  quantity: number;
  operator: string;
  machine: string;
  status: "completed" | "in-progress" | "issue";
  notes?: string;
}

const ProductionLog = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [shiftFilter, setShiftFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Generate mock production log data
  const generateProductionLogData = (): ProductionLogEntry[] => {
    const products = [
      "Vỏ điện thoại Model A",
      "Hộp đựng thực phẩm",
      "Nắp chai nước",
      "Khay nhựa đựng linh kiện",
      "Vỏ máy tính",
    ];

    const operators = ["Nguyễn Văn B", "Trần Văn C", "Lê Thị D", "Phạm Văn E"];

    const machines = ["MS-001", "MS-002", "MS-003", "MS-004"];

    const statuses: ("completed" | "in-progress" | "issue")[] = [
      "completed",
      "in-progress",
      "issue",
    ];

    const shifts: ("morning" | "afternoon" | "night")[] = [
      "morning",
      "afternoon",
      "night",
    ];

    const entries: ProductionLogEntry[] = [];

    // Generate 15 random entries
    for (let i = 0; i < 15; i++) {
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      const randomOperator =
        operators[Math.floor(Math.random() * operators.length)];
      const randomMachine =
        machines[Math.floor(Math.random() * machines.length)];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      const randomShift = shifts[Math.floor(Math.random() * shifts.length)];
      const randomQuantity = Math.floor(Math.random() * 1000) + 100;

      entries.push({
        id: `LOG-${i + 1}`,
        date: new Date(),
        shift: randomShift,
        orderNumber: `LSX-2023-${(i + 1).toString().padStart(3, "0")}`,
        product: randomProduct,
        quantity: randomQuantity,
        operator: randomOperator,
        machine: randomMachine,
        status: randomStatus,
        notes: randomStatus === "issue" ? "Gặp sự cố kỹ thuật, đã xử lý" : "",
      });
    }

    return entries;
  };

  const [logEntries, setLogEntries] = useState<ProductionLogEntry[]>(
    generateProductionLogData(),
  );

  const filteredEntries = logEntries.filter((entry) => {
    const matchesShift = !shiftFilter || entry.shift === shiftFilter;
    const matchesStatus = !statusFilter || entry.status === statusFilter;
    const matchesSearch =
      entry.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.operator.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesShift && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Hoàn thành
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Đang sản xuất
          </Badge>
        );
      case "issue":
        return <Badge variant="destructive">Có sự cố</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case "morning":
        return "Ca sáng (6:00 - 14:00)";
      case "afternoon":
        return "Ca chiều (14:00 - 22:00)";
      case "night":
        return "Ca đêm (22:00 - 6:00)";
      default:
        return shift;
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Nhật ký sản xuất</h1>
            <p className="text-muted-foreground">
              Theo dõi hoạt động sản xuất theo ca
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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhật ký
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
                  placeholder="Tìm kiếm theo mã lệnh, sản phẩm..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={"w-[240px] justify-start text-left font-normal"}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "PPP", { locale: vi })
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                value={shiftFilter || ""}
                onValueChange={(value) =>
                  setShiftFilter(value === "" ? null : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>
                      {shiftFilter === "morning"
                        ? "Ca sáng"
                        : shiftFilter === "afternoon"
                          ? "Ca chiều"
                          : shiftFilter === "night"
                            ? "Ca đêm"
                            : "Tất cả ca"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả ca</SelectItem>
                  <SelectItem value="morning">Ca sáng</SelectItem>
                  <SelectItem value="afternoon">Ca chiều</SelectItem>
                  <SelectItem value="night">Ca đêm</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter || ""}
                onValueChange={(value) =>
                  setStatusFilter(value === "" ? null : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>
                      {statusFilter === "completed"
                        ? "Hoàn thành"
                        : statusFilter === "in-progress"
                          ? "Đang sản xuất"
                          : statusFilter === "issue"
                            ? "Có sự cố"
                            : "Trạng thái"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="in-progress">Đang sản xuất</SelectItem>
                  <SelectItem value="issue">Có sự cố</SelectItem>
                </SelectContent>
              </Select>
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
                    <TableHead>Mã nhật ký</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Ca</TableHead>
                    <TableHead>Mã lệnh</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Người vận hành</TableHead>
                    <TableHead>Máy</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.id}</TableCell>
                      <TableCell>{format(entry.date, "dd/MM/yyyy")}</TableCell>
                      <TableCell>{getShiftLabel(entry.shift)}</TableCell>
                      <TableCell>{entry.orderNumber}</TableCell>
                      <TableCell>{entry.product}</TableCell>
                      <TableCell>{entry.quantity}</TableCell>
                      <TableCell>{entry.operator}</TableCell>
                      <TableCell>{entry.machine}</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
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
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled>
                Trước
              </Button>
              <Button variant="outline" size="sm" disabled>
                Sau
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProductionLog;
