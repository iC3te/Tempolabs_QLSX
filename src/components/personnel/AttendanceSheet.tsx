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
  Check,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: Date;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late" | "half-day" | "leave";
  notes?: string;
}

const AttendanceSheet = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Generate mock attendance data
  const generateAttendanceData = (): AttendanceRecord[] => {
    const employees = [
      { id: "EMP001", name: "Nguyễn Văn A", department: "Sản xuất" },
      { id: "EMP002", name: "Trần Thị B", department: "Kỹ thuật" },
      { id: "EMP003", name: "Lê Văn C", department: "Sản xuất" },
      { id: "EMP004", name: "Phạm Thị D", department: "Kho vận" },
      { id: "EMP005", name: "Hoàng Văn E", department: "Kỹ thuật" },
    ];

    const statuses: ("present" | "absent" | "late" | "half-day" | "leave")[] = [
      "present",
      "absent",
      "late",
      "half-day",
      "leave",
    ];

    return employees.map((employee, index) => {
      // Randomly assign status with higher probability for present
      const randomStatus =
        Math.random() < 0.7
          ? "present"
          : statuses[Math.floor(Math.random() * statuses.length)];

      // Generate check-in time (between 7:30 and 8:30)
      const checkInHour = randomStatus === "late" ? 9 : 8;
      const checkInMinute = Math.floor(Math.random() * 60);
      const checkIn = `${checkInHour.toString().padStart(2, "0")}:${checkInMinute
        .toString()
        .padStart(2, "0")}`;

      // Generate check-out time (between 17:00 and 18:00)
      const checkOutHour = randomStatus === "half-day" ? 12 : 17;
      const checkOutMinute = Math.floor(Math.random() * 60);
      const checkOut = `${checkOutHour
        .toString()
        .padStart(2, "0")}:${checkOutMinute.toString().padStart(2, "0")}`;

      return {
        id: `ATT${index + 1}`,
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
        date: new Date(date),
        checkIn:
          randomStatus === "absent" || randomStatus === "leave"
            ? "--:--"
            : checkIn,
        checkOut:
          randomStatus === "absent" || randomStatus === "leave"
            ? "--:--"
            : checkOut,
        status: randomStatus,
        notes:
          randomStatus === "leave"
            ? "Nghỉ phép có phép"
            : randomStatus === "absent"
              ? "Vắng không lý do"
              : "",
      };
    });
  };

  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >(generateAttendanceData());

  // Update attendance data when date changes
  React.useEffect(() => {
    setAttendanceRecords(generateAttendanceData());
  }, [date]);

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesDepartment =
      !departmentFilter || record.department === departmentFilter;
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge variant="default" className="bg-green-500">
            Có mặt
          </Badge>
        );
      case "absent":
        return <Badge variant="destructive">Vắng mặt</Badge>;
      case "late":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Đi muộn
          </Badge>
        );
      case "half-day":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Nửa ngày
          </Badge>
        );
      case "leave":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Nghỉ phép
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const departments = ["Sản xuất", "Kỹ thuật", "Kho vận", "Hành chính"];

  const getAttendanceSummary = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(
      (record) => record.status === "present",
    ).length;
    const absent = attendanceRecords.filter(
      (record) => record.status === "absent",
    ).length;
    const late = attendanceRecords.filter(
      (record) => record.status === "late",
    ).length;
    const halfDay = attendanceRecords.filter(
      (record) => record.status === "half-day",
    ).length;
    const leave = attendanceRecords.filter(
      (record) => record.status === "leave",
    ).length;

    return { total, present, absent, late, halfDay, leave };
  };

  const summary = getAttendanceSummary();

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bảng chấm công</h1>
            <p className="text-muted-foreground">
              Theo dõi chấm công nhân viên theo ngày
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

        {/* Date Selector and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
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
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                value={departmentFilter || ""}
                onValueChange={(value) =>
                  setDepartmentFilter(value === "" ? null : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>{departmentFilter || "Phòng ban"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả phòng ban</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
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
                      {statusFilter === "present"
                        ? "Có mặt"
                        : statusFilter === "absent"
                          ? "Vắng mặt"
                          : statusFilter === "late"
                            ? "Đi muộn"
                            : statusFilter === "half-day"
                              ? "Nửa ngày"
                              : statusFilter === "leave"
                                ? "Nghỉ phép"
                                : "Trạng thái"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="present">Có mặt</SelectItem>
                  <SelectItem value="absent">Vắng mặt</SelectItem>
                  <SelectItem value="late">Đi muộn</SelectItem>
                  <SelectItem value="half-day">Nửa ngày</SelectItem>
                  <SelectItem value="leave">Nghỉ phép</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng nhân viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Có mặt</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="text-2xl font-bold text-green-600">
                {summary.present}
              </div>
              <Check className="ml-2 h-5 w-5 text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vắng mặt</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="text-2xl font-bold text-red-600">
                {summary.absent}
              </div>
              <X className="ml-2 h-5 w-5 text-red-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Đi muộn</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="text-2xl font-bold text-amber-600">
                {summary.late}
              </div>
              <Clock className="ml-2 h-5 w-5 text-amber-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nửa ngày</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">
                {summary.halfDay}
              </div>
              <AlertCircle className="ml-2 h-5 w-5 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nghỉ phép</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">
                {summary.leave}
              </div>
              <CalendarIcon className="ml-2 h-5 w-5 text-purple-600" />
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Chấm công ngày {format(date, "dd/MM/yyyy")}</CardTitle>
            <CardDescription>
              Hiển thị {filteredRecords.length} nhân viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã NV</TableHead>
                    <TableHead>Tên nhân viên</TableHead>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead>Giờ vào</TableHead>
                    <TableHead>Giờ ra</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.employeeId}
                      </TableCell>
                      <TableCell>{record.employeeName}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{record.notes || "--"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Cập nhật lần cuối: {format(new Date(), "HH:mm:ss dd/MM/yyyy")}
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Cập nhật
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceSheet;
